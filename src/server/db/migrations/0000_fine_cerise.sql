CREATE TABLE "account_history" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_number" varchar NOT NULL,
	"date_time" timestamp NOT NULL,
	"remarks" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_number" varchar NOT NULL,
	"month_1_usage" real NOT NULL,
	"month_2_usage" real NOT NULL,
	"month_3_usage" real NOT NULL,
	"month_4_usage" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leakages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"nearest_meter_number" varchar,
	"remarks" text,
	"additional_remarks" text,
	"date_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"position_title" varchar NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "login_accounts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "new_meters" (
	"id" varchar PRIMARY KEY NOT NULL,
	"current_reading" real,
	"meter_number" varchar NOT NULL,
	"image" text,
	"date_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"meter_code" integer NOT NULL,
	"consumer_type" varchar NOT NULL,
	"description" text,
	"minimum_rate" real NOT NULL,
	"rate_11" real NOT NULL,
	"rate_21" real NOT NULL,
	"rate_31" real NOT NULL,
	"rate_41" real NOT NULL,
	"rate_51" real NOT NULL,
	CONSTRAINT "rates_meter_code_consumer_type_unique" UNIQUE("meter_code","consumer_type")
);
--> statement-breakpoint
CREATE TABLE "reading_details" (
	"id" varchar PRIMARY KEY NOT NULL,
	"meter_reader_id" varchar NOT NULL,
	"account_number" varchar NOT NULL,
	"account_name" varchar NOT NULL,
	"meter_number" varchar NOT NULL,
	"check_digit" integer NOT NULL,
	"meter_code" integer NOT NULL,
	"consumer_type" varchar NOT NULL,
	"previous_reading" real NOT NULL,
	"longlat" varchar NOT NULL,
	"zone_code" varchar NOT NULL,
	"book_code" varchar NOT NULL,
	"meter_status" varchar NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"sequence_number" varchar NOT NULL,
	"address" text NOT NULL,
	"date_installed" timestamp NOT NULL,
	"disconnection_type" varchar NOT NULL,
	"reading_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"disconnection_date" timestamp NOT NULL,
	"reconnection_date" timestamp NOT NULL,
	"contact_number" varchar NOT NULL,
	"classification" varchar NOT NULL,
	"arrears" real NOT NULL,
	"current_reading" real,
	"billed_amount" real,
	"remarks" varchar,
	"additional_remakrs" varchar,
	"image" text,
	"print_count" integer,
	CONSTRAINT "reading_details_account_number_unique" UNIQUE("account_number"),
	CONSTRAINT "reading_details_meter_number_unique" UNIQUE("meter_number"),
	CONSTRAINT "reading_details_zone_code_unique" UNIQUE("zone_code"),
	CONSTRAINT "reading_details_book_code_unique" UNIQUE("book_code"),
	CONSTRAINT "reading_details_meter_code_consumer_type_unique" UNIQUE("meter_code","consumer_type")
);
--> statement-breakpoint
CREATE TABLE "water_concerns" (
	"id" varchar PRIMARY KEY NOT NULL,
	"nearest_water_meter" varchar,
	"remarks" text,
	"additional_remarks" text,
	"image" text,
	"date_time" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_history" ADD CONSTRAINT "account_history_account_number_reading_details_account_number_fk" FOREIGN KEY ("account_number") REFERENCES "public"."reading_details"("account_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage" ADD CONSTRAINT "usage_account_number_reading_details_account_number_fk" FOREIGN KEY ("account_number") REFERENCES "public"."reading_details"("account_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rates" ADD CONSTRAINT "rates_meter_code_consumer_type_reading_details_meter_code_consumer_type_fk" FOREIGN KEY ("meter_code","consumer_type") REFERENCES "public"."reading_details"("meter_code","consumer_type") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_details" ADD CONSTRAINT "reading_details_meter_reader_id_login_accounts_id_fk" FOREIGN KEY ("meter_reader_id") REFERENCES "public"."login_accounts"("id") ON DELETE no action ON UPDATE no action;