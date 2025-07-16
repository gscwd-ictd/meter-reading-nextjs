ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "accounts" CASCADE;--> statement-breakpoint
ALTER TABLE "reading_details" RENAME COLUMN "account_no" TO "account_number";--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "meter_reader_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "billed_amount" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "billed_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "reading_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "reading_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "due_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "due_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "disconnection_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "disconnection_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_details" ALTER COLUMN "remarks" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "account_name" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "meter_number" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "previous_reading" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "zone_code" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "book_code" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "meter_status" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "is_read" boolean;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "sequence_number" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "address" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "date_installed" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "disconnection_type" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "reconnection_date" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "contact_number" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "classification" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "arrears" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "current_reading" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "longlat" text;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "print_count" integer;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "check_digit" integer;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "consumer_type" varchar;--> statement-breakpoint
ALTER TABLE "reading_details" ADD COLUMN "meter_code" integer;--> statement-breakpoint
ALTER TABLE "reading_details" DROP COLUMN "present_reading";--> statement-breakpoint
ALTER TABLE "reading_details" DROP COLUMN "usage";--> statement-breakpoint
ALTER TABLE "reading_details" DROP COLUMN "penalty";--> statement-breakpoint
ALTER TABLE "reading_details" DROP COLUMN "is_posted";