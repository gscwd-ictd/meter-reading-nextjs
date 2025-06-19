import { hrmsDb } from "@/server/db/mysql-connection";
import { db } from "@/server/db/postgres-connection";
import {
  meterReaders,
  meterReaderZoneBook,
  meterReaderZoneBookView,
} from "@/server/db/schemas/meter-readers";
import { paginate } from "@/server/helpers/paginate";
import { IMeterReaderRepository } from "@/server/interfaces/meter-readers/meter-readers.interface.repository";
import {
  AssignedMeterReader,
  CreateAssignedMeterReader,
  MeterReader,
  MeterReaderSchema,
  PaginatedAssignedMeterReader,
  PaginatedUnassignedMeterReader,
  UnassignedMeterReader,
  UnassignedMeterReaderSchema,
} from "@/server/types/meter-reader.type";
import { eq, sql } from "drizzle-orm";
import { MySqlQueryResult } from "drizzle-orm/mysql2";
import { HTTPException } from "hono/http-exception";

export class MeterReaderRepository implements IMeterReaderRepository {
  async findUnassignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedMeterReader[] | PaginatedUnassignedMeterReader> {
    const isPaginated = page !== 0 && limit !== 0;

    // 1. Fetch all employees (unpaginated)
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`CALL sp_get_all_commercial_employees(${query})`,
    );

    const employees = UnassignedMeterReaderSchema.array().parse(rawEmployees);

    // 2. Fetch assigned meter readers
    const stmt = db.select().from(meterReaders).prepare("get_all_assigned_meter_readers");
    const assignedMeterReaders = await stmt.execute();

    // 3. Build a Map of employeeId => assigned meter reader record
    const assignedMap = new Map(assignedMeterReaders.map((p) => [p.employeeId, p]));

    // 4. Filter employees to only those NOT in assignedMap (unassigned)
    const unassignedEmployees = employees.filter(
      (emp: UnassignedMeterReader) => !assignedMap.has(emp.employeeId),
    );

    // 5. Apply pagination if requested
    if (isPaginated) {
      return paginate(unassignedEmployees, page, limit);
    }

    // 6. Return full list if no pagination requested
    return unassignedEmployees;
  }

  async findAssignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedMeterReader[] | PaginatedAssignedMeterReader> {
    const isPaginated = page !== 0 && limit !== 0;

    // 1. Fetch all employees
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`CALL sp_get_all_commercial_employees(${query})`,
    );

    const employees = UnassignedMeterReaderSchema.array().parse(rawEmployees);

    // 2. Fetch assigned meter reader
    const stmt = db
      .select()
      .from(meterReaderZoneBookView)
      .$dynamic()
      .prepare("get_all_meter_reader_zone_book_view");

    const executeStmt = await stmt.execute();

    const assignedMeterReader = MeterReaderSchema.array().parse(executeStmt);

    const assignedMap = new Map(assignedMeterReader.map((p) => [p.employeeId, p]));

    // 3. Filter and enrich
    const enriched = employees
      .filter((emp) => assignedMap.has(emp.employeeId))
      .map((emp) => ({
        ...assignedMap.get(emp.employeeId)!,
        ...emp,
      }));

    // 4. Paginate
    if (isPaginated) {
      return paginate(enriched, page, limit);
    }

    return enriched;
  }

  async createMeterReader(data: CreateAssignedMeterReader): Promise<MeterReader> {
    const { zoneBooks, ...rest } = data;

    const result = await db.transaction(async (tx) => {
      // Insert into meter reader and return the created row
      const [insertMeterReader] = await tx.insert(meterReaders).values(rest).returning();

      // Bulk insert zoneBooks in one query
      await tx
        .insert(meterReaderZoneBook)
        .values(
          zoneBooks.map((item) => ({
            meterReaderId: insertMeterReader.meterReaderId,
            ...item,
          })),
        )
        .returning();

      const [result] = await tx
        .select()
        .from(meterReaderZoneBookView)
        .where(eq(meterReaderZoneBookView.meterReaderId, insertMeterReader.meterReaderId));

      const parseResult = MeterReaderSchema.parse(result);

      return parseResult;
    });

    return result;
  }

  async findMeterReaderById(id: string): Promise<AssignedMeterReader> {
    const stmt = db
      .select()
      .from(meterReaderZoneBookView)
      .where(eq(meterReaderZoneBookView.meterReaderId, id))
      .$dynamic()
      .prepare("get_meter_reader_zone_book_view_by_meter_id");

    const [executeStmt] = await stmt.execute();

    if (!executeStmt) {
      throw new HTTPException(404, { message: `Meter reader id ${id} not found` });
    }

    const parseResult = MeterReaderSchema.parse(executeStmt);

    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`select employee_id as employeeId, company_id as companyId, name, position_title as positionTitle, assignment, mobile_number as mobileNumber, photo_url as photoUrl from all_employees_view where employee_id = ${parseResult.employeeId}`,
    );

    const parseRaw = UnassignedMeterReaderSchema.parse(rawEmployees);

    return {
      ...parseResult,
      ...parseRaw,
    };
  }

  /* async updateMeterReaderById(id: string, data: CreateAssignedMeterReader): Promise<MeterReader> {
    return { meterReaderId: id, ...data };
  } */
}
