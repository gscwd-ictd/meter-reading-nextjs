CREATE TYPE "public"."rest_day_enum" AS ENUM('6', '0');--> statement-breakpoint
CREATE TABLE "area" (
	"area_id" varchar PRIMARY KEY NOT NULL,
	"area" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "area_area_unique" UNIQUE("area")
);
--> statement-breakpoint
CREATE TABLE "meter_reader_zone_book" (
	"meter_reader_zone_book_id" varchar PRIMARY KEY NOT NULL,
	"meter_reader_id" varchar NOT NULL,
	"zone" varchar NOT NULL,
	"book" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_meter_reader_zone_book" UNIQUE("zone","book")
);
--> statement-breakpoint
CREATE TABLE "meter_readers" (
	"meter_reader_id" varchar PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"mobile_number" varchar(13) NOT NULL,
	"password" text DEFAULT 'password' NOT NULL,
	"rest_day" "rest_day_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "meter_readers_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "meter_readers_mobile_number_unique" UNIQUE("mobile_number")
);
--> statement-breakpoint
CREATE TABLE "schedule_meter_readers" (
	"schedule_meter_reader_id" varchar PRIMARY KEY NOT NULL,
	"schedule_id" varchar NOT NULL,
	"meter_reader_id" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_schedule_meter_reader" UNIQUE("schedule_id","meter_reader_id")
);
--> statement-breakpoint
CREATE TABLE "schedule_zone_books" (
	"schedule_zone_book_id" varchar PRIMARY KEY NOT NULL,
	"schedule_meter_reader_id" varchar NOT NULL,
	"zone" varchar NOT NULL,
	"book" varchar NOT NULL,
	"due_date" date NOT NULL,
	"disconnection_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_schedule_zone_book" UNIQUE("schedule_meter_reader_id","zone","book")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"schedule_id" varchar PRIMARY KEY NOT NULL,
	"reading_date" date NOT NULL,
	"due_date" jsonb NOT NULL,
	"disconnection_date" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "schedules_reading_date_unique" UNIQUE("reading_date")
);
--> statement-breakpoint
CREATE TABLE "zone_book" (
	"zone_book_id" varchar PRIMARY KEY NOT NULL,
	"area_id" varchar NOT NULL,
	"zone" varchar NOT NULL,
	"book" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_zone_book" UNIQUE("zone","book")
);
--> statement-breakpoint
ALTER TABLE "meter_reader_zone_book" ADD CONSTRAINT "meter_reader_zone_book_meter_reader_id_meter_readers_meter_reader_id_fk" FOREIGN KEY ("meter_reader_id") REFERENCES "public"."meter_readers"("meter_reader_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_meter_readers" ADD CONSTRAINT "schedule_meter_readers_schedule_id_schedules_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("schedule_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_meter_readers" ADD CONSTRAINT "schedule_meter_readers_meter_reader_id_meter_readers_meter_reader_id_fk" FOREIGN KEY ("meter_reader_id") REFERENCES "public"."meter_readers"("meter_reader_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_zone_books" ADD CONSTRAINT "schedule_zone_books_schedule_meter_reader_id_schedule_meter_readers_schedule_meter_reader_id_fk" FOREIGN KEY ("schedule_meter_reader_id") REFERENCES "public"."schedule_meter_readers"("schedule_meter_reader_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zone_book" ADD CONSTRAINT "zone_book_area_id_area_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("area_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_smr_schedule" ON "schedule_meter_readers" USING btree ("schedule_id");--> statement-breakpoint
CREATE INDEX "idx_schedule_zone_book_meter_reader" ON "schedule_zone_books" USING btree ("schedule_meter_reader_id");--> statement-breakpoint
CREATE INDEX "idx_schedule_reading_date" ON "schedules" USING btree ("reading_date");--> statement-breakpoint
CREATE VIEW "public"."meter_reader_zone_book_view" AS (select "meter_readers"."meter_reader_id", "meter_readers"."employee_id", "meter_readers"."mobile_number", "meter_readers"."rest_day", 
        jsonb_agg(
          jsonb_build_object(
            'zone', "meter_reader_zone_book"."zone",
            'book', "meter_reader_zone_book"."book",
            'zoneBook', "meter_reader_zone_book"."zone" || '-' || "meter_reader_zone_book"."book"
          )
        )
       as "zoneBooks" from "meter_readers" inner join "meter_reader_zone_book" on "meter_readers"."meter_reader_id" = "meter_reader_zone_book"."meter_reader_id" group by "meter_readers"."meter_reader_id", "meter_readers"."employee_id", "meter_readers"."rest_day");--> statement-breakpoint
CREATE VIEW "public"."schedule_zone_book_view" AS (select "schedules"."reading_date", "schedules"."due_date", "schedules"."disconnection_date", json_agg(
        jsonb_build_object(
          'scheduleId', "schedules"."schedule_id",
          'meterReaderId', "schedule_meter_readers"."meter_reader_id",
          'zoneBooks', coalesce((
            select json_agg(
              jsonb_build_object(
                'zone', "schedule_zone_books"."zone",
                'book', "schedule_zone_books"."book",
                'zoneBook', "schedule_zone_books"."zone" || '-' || "schedule_zone_books"."book"
              )
            )
            FROM "schedule_zone_books"
            WHERE "schedule_zone_books"."schedule_meter_reader_id" = "schedule_meter_readers"."schedule_meter_reader_id"
          ), '[]'::json)
        )
      ) as "meterReaders" from "schedules" left join "schedule_meter_readers" on "schedules"."schedule_id" = "schedule_meter_readers"."schedule_id" left join "schedule_zone_books" on "schedule_meter_readers"."schedule_meter_reader_id" = "schedule_zone_books"."schedule_meter_reader_id" group by "schedules"."schedule_id", "schedules"."reading_date", "schedules"."due_date", "schedules"."disconnection_date" order by "schedules"."reading_date");