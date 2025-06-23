CREATE TABLE "login_accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"number" varchar NOT NULL,
	"password" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "login_accounts_number_unique" UNIQUE("number")
);
