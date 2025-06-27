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
CREATE TABLE "account_history" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_number" varchar,
	"date_time" varchar,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_name" varchar,
	"meter_number" varchar,
	"previous_reading" varchar,
	"zone_code" varchar,
	"book_code" varchar,
	"meter_status" varchar,
	"is_read" boolean,
	"sequence_number" varchar,
	"address" varchar,
	"date_installed" varchar,
	"disconnection_type" varchar,
	"disconnection_date" varchar,
	"reconnection_date" varchar,
	"contact_number" varchar,
	"classification" varchar,
	"arrears" varchar,
	"current_reading" varchar,
	"billed_amount" varchar,
	"remarks" text,
	"additional_remarks" text,
	"image" text,
	"longlat" text,
	"print_count" integer,
	"check_digit" integer,
	"due_date" varchar,
	"consumer_type" varchar,
	"meter_code" integer
);
--> statement-breakpoint
CREATE TABLE "leakage" (
	"id" varchar PRIMARY KEY NOT NULL,
	"nearest_meter_number" text,
	"remarks" text,
	"additional_remarks" text,
	"date_time" varchar
);
--> statement-breakpoint
CREATE TABLE "new_meter" (
	"id" varchar PRIMARY KEY NOT NULL,
	"current_reading" varchar,
	"meter_number" varchar,
	"image" varchar,
	"date_time" varchar
);
--> statement-breakpoint
CREATE TABLE "rates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_type" varchar,
	"description" text,
	"meter_code" integer,
	"minimum_rate" real,
	"rate11" real,
	"rate21" real,
	"rate31" real,
	"rate41" real,
	"rate51" real
);
--> statement-breakpoint
CREATE TABLE "reading_details" (
	"id" varchar PRIMARY KEY NOT NULL,
	"meter_reader_id" varchar NOT NULL,
	"account_no" varchar NOT NULL,
	"present_reading" double precision NOT NULL,
	"usage" double precision NOT NULL,
	"billed_amount" double precision NOT NULL,
	"reading_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"disconnection_date" timestamp NOT NULL,
	"remarks" varchar,
	"additional_remarks" text,
	"penalty" double precision,
	"is_posted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_number" varchar,
	"month1_usage" varchar,
	"month2_usage" varchar,
	"month3_usage" varchar,
	"month4_usage" varchar
);
--> statement-breakpoint
CREATE TABLE "water_concerns" (
	"id" varchar PRIMARY KEY NOT NULL,
	"remarks" text,
	"additional_remarks" text,
	"nearest_meter_number" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "zone_book_address" (
	"id" varchar PRIMARY KEY NOT NULL,
	"zone_code" integer,
	"book_code" integer,
	"address" text
);
