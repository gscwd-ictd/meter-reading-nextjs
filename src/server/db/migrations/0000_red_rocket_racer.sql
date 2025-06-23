CREATE TABLE "reading_details" (
	"id" varchar PRIMARY KEY NOT NULL,
	"meter_reader_id" varchar NOT NULL,
	"account_no" varchar NOT NULL,
	"present_reading" integer NOT NULL,
	"usage" integer NOT NULL,
	"billed_amount" integer NOT NULL,
	"reading_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"disconnection_date" timestamp NOT NULL,
	"remarks" varchar,
	"additional_remarks" text,
	"penalty" integer,
	"is_posted" boolean DEFAULT false NOT NULL
);
