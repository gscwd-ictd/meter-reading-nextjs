import { hrmsDb } from "@mr/server/db/mysql-connection";
import db from "@mr/server/db/connections";
import {
  meterReaders,
  meterReaderZoneBook,
  viewMeterReaderZoneBook,
  viewZoneBookAssignment,
} from "@mr/server/db/schemas/meter-readers";
import { paginate } from "@mr/server/helpers/paginate";
import { IMeterReaderRepository } from "@mr/server/interfaces/meter-readers/meter-readers.interface.repository";
import {
  EmployeeDetails,
  EmployeeDetailsSchema,
  MeterReader,
  MeterReaderSchema,
  PaginatedMeterReader,
  PaginatedEmployeeDetails,
  AssignMeterReader,
  MeterReaderDetails,
  MeterReaderDetailsSchema,
} from "@mr/server/types/meter-reader.type";
import { eq, isNotNull, isNull, sql } from "drizzle-orm";
import { MySqlQueryResult } from "drizzle-orm/mysql2";
import { HTTPException } from "hono/http-exception";
import { ZoneBook, ZoneBookSchema } from "@mr/server/types/zone-book.type";
import { loginAccounts } from "@mr/server/db/schemas/login-accounts";
import * as argon2 from "argon2";

export class MeterReaderRepository implements IMeterReaderRepository {
  async findEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]> {
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`CALL sp_get_all_commercial_employees(${query})`,
    );

    return EmployeeDetailsSchema.array().parse(rawEmployees);
  }

  async findEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails> {
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`select employee_id as employeeId, company_id as companyId, name, position_title as positionTitle, assignment, photo_url as photoUrl from all_employees_view where employee_id = ${employeeId}`,
    );

    return EmployeeDetailsSchema.parse(rawEmployees);
  }

  async findZoneBookByStatus(status: string): Promise<ZoneBook[]> {
    if (status === "assigned") {
      const stmt = await db.pgConn
        .select()
        .from(viewZoneBookAssignment)
        .where(isNotNull(viewZoneBookAssignment.meterReaderId));
      return ZoneBookSchema.array().parse(stmt);
    }

    if (status === "unassigned") {
      const stmt = await db.pgConn
        .select()
        .from(viewZoneBookAssignment)
        .where(isNull(viewZoneBookAssignment.meterReaderId));
      return ZoneBookSchema.array().parse(stmt);
    }

    // default: all
    const stmt = await db.pgConn.select().from(viewZoneBookAssignment);
    return ZoneBookSchema.array().parse(stmt);
  }

  async findUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails> {
    const isPaginated = page !== 0 && limit !== 0;

    // Step 1: Get all assigned meter reader employee ids
    const stmt = db.pgConn
      .select({ employeeId: meterReaders.employeeId })
      .from(meterReaders)
      .prepare("get_all_assigned_meter_readers");

    const assigned = await stmt.execute();

    // Step 2: Get all employees matching search query
    const employees = await this.findEmployeeDetailsByName(query); // assumed to return employee list

    // Step 3: Build a Set of assigned employee IDs
    const assignedIds = new Set(assigned.map((a) => a.employeeId));

    // Step 4: Filter to get unassigned employees
    const unassignedEmployees = employees.filter((emp) => !assignedIds.has(emp.employeeId));

    // Step 5: Return either full list or paginated result
    return isPaginated ? paginate(unassignedEmployees, page, limit) : unassignedEmployees;
  }

  async findAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReader[] | PaginatedMeterReader> {
    const isPaginated = page !== 0 && limit !== 0;

    // Step 1: Query all meter readers that have zone book assignments
    const stmt = db.pgConn
      .select()
      .from(viewMeterReaderZoneBook)
      .$dynamic()
      .prepare("get_all_meter_reader_zone_book_view");

    const assigned = await stmt.execute();

    // Step 2: Get employees that match the name query
    const employees = await this.findEmployeeDetailsByName(query);

    // Step 3: Create a quick lookup map of assigned employees
    const assignedMap = new Map(assigned.map((p) => [p.employeeId, p]));

    // Step 4: Enrich matched employees with assignment info if available
    const enriched = employees
      .filter((emp) => assignedMap.has(emp.employeeId))
      .map((emp) => ({
        ...assignedMap.get(emp.employeeId)!,
        ...emp,
      }));

    // Step 5: Validate against schema
    const parsed = MeterReaderSchema.array().parse(enriched);

    return isPaginated ? paginate(parsed, page, limit) : parsed;
  }

  async findMeterReaderDetailsById(meterReaderId: string): Promise<MeterReaderDetails> {
    const stmt = db.pgConn
      .select({
        id: meterReaders.id,
        employeeId: meterReaders.employeeId,
        restDay: meterReaders.restDay,
        mobileNumber: loginAccounts.username,
      })
      .from(meterReaders)
      .innerJoin(loginAccounts, eq(loginAccounts.meterReaderId, meterReaders.id))
      .where(eq(meterReaders.id, meterReaderId))
      .$dynamic()
      .prepare("get_meter_reader_details_by_id");

    const [meterReader] = await stmt.execute();

    if (!meterReader) {
      throw new HTTPException(404, { message: `meter reader with id ${meterReaderId} not found` });
    }

    // Step 3: Fetch employee details using employeeId
    const employeeDetails = await this.findEmployeeDetailsById(meterReader.employeeId);

    // Step 4: Merge and validate using Zod
    const parsed = MeterReaderDetailsSchema.parse({ ...employeeDetails, ...meterReader });

    return parsed;
  }

  async findMeterReaderWithZoneBookById(meterReaderId: string): Promise<MeterReader> {
    // Step 1: Query the view by meterReaderId
    const stmt = db.pgConn
      .select()
      .from(viewMeterReaderZoneBook)
      .where(eq(viewMeterReaderZoneBook.id, meterReaderId))
      .$dynamic()
      .prepare("get_meter_reader_with_zone_book_by_meter_id");

    const [meterReader] = await stmt.execute();

    // Step 2: Handle not found
    if (!meterReader) {
      throw new HTTPException(404, { message: `meter reader with id ${meterReaderId} not found` });
    }

    // Step 3: Fetch employee details using employeeId
    const employeeDetails = await this.findEmployeeDetailsById(meterReader.employeeId);

    // Step 4: Merge and validate using Zod
    const parsed = MeterReaderSchema.parse({ ...employeeDetails, ...meterReader });

    return parsed;
  }

  async assignMeterReader(data: AssignMeterReader): Promise<MeterReader> {
    // Destructure zoneBooks from input, and keep the rest of the fields for insertion
    const { zoneBooks, mobileNumber, ...meterReaderData } = data;

    // Set default password and hash it
    const hashedPw = await argon2.hash("password");

    // Use a transaction to ensure all DB changes happen together
    const result = await db.pgConn.transaction(async (tx) => {
      // Step 1: Insert the new meter reader
      const [insertedMeterReader] = await tx.insert(meterReaders).values(meterReaderData).returning();

      if (!insertedMeterReader) {
        throw new HTTPException(500, { message: "failed to insert meter reader." });
      }

      // Step 2: Create the login account with default password
      await tx.insert(loginAccounts).values({
        meterReaderId: insertedMeterReader.id,
        username: mobileNumber,
        password: hashedPw,
      });

      // Step 3: Insert assigned zone-books
      if (zoneBooks?.length) {
        await tx.insert(meterReaderZoneBook).values(
          zoneBooks.map((item) => ({
            meterReaderId: insertedMeterReader.id,
            ...item,
          })),
        );
      }

      // Step 4: Return only the ID — avoid mixing read concerns into transaction
      return insertedMeterReader.id;
    });

    return await this.findMeterReaderWithZoneBookById(result);
  }

  async updateMeterReaderById(meterReaderId: string, data: AssignMeterReader): Promise<MeterReader> {
    const { zoneBooks, mobileNumber, ...rest } = data;

    // Step 1: Ensure the meter reader exists
    await this.findMeterReaderWithZoneBookById(meterReaderId);

    // Step 2: Perform update and re-assignment in a transaction
    await db.pgConn.transaction(async (tx) => {
      // Update main meter reader record
      const [update] = await tx
        .update(meterReaders)
        .set(rest)
        .where(eq(meterReaders.id, meterReaderId))
        .returning();

      if (!update) {
        throw new HTTPException(500, { message: `failed to update meter reader with id ${meterReaderId}.` });
      }

      await tx
        .update(loginAccounts)
        .set({ username: mobileNumber })
        .where(eq(loginAccounts.meterReaderId, meterReaderId))
        .returning();

      // Remove existing zone-book assignments
      await tx.delete(meterReaderZoneBook).where(eq(meterReaderZoneBook.meterReaderId, meterReaderId));

      // Re-insert new zoneBooks if provided
      if (zoneBooks?.length) {
        await tx
          .insert(meterReaderZoneBook)
          .values(
            zoneBooks.map((item) => ({
              meterReaderId: meterReaderId,
              ...item,
            })),
          )
          .returning();
      }
    });

    // Step 3: Return the updated and enriched meter reader
    return await this.findMeterReaderWithZoneBookById(meterReaderId);
  }

  async removeMeterReaderById(meterReaderId: string): Promise<MeterReader> {
    // Step 1: Check if meter reader exists
    const findMeterReader = await this.findMeterReaderWithZoneBookById(meterReaderId);

    if (!findMeterReader) {
      throw new HTTPException(404, { message: `meter reader with id ${meterReaderId} not found.` });
    }

    // Step 2: Delete the meter reader
    const stmtDelete = db.pgConn
      .delete(meterReaders)
      .where(eq(meterReaders.id, meterReaderId))
      .returning()
      .prepare("delete_meter_reader_by_id");

    const result = await stmtDelete.execute();

    // Step 3: Check if deletion was successful
    if (!result || result.length === 0) {
      throw new HTTPException(500, { message: `failed to remove meter reader with ${meterReaderId}.` });
    }

    // Step 4: Return the previously fetched data (before deletion)
    return findMeterReader;
  }
}
