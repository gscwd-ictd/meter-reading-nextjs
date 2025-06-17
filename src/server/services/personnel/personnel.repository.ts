import { hrmsDb } from "@/server/db/mysql-connection";
import { db } from "@/server/db/postgres-connection";
import { personnel, personnelZoneBook, personnelZoneBookView } from "@/server/db/schemas/personnel";
import { paginate } from "@/server/helpers/paginate";
import { IPersonnelRepository } from "@/server/interfaces/personnel/personnel.interface.repository";
import {
  AssignedPersonnel,
  AssignedPersonnelSchema,
  CreateAssignedPersonnel,
  PaginatedAssignedPersonnel,
  PaginatedUnassignedPersonnel,
  Personnel,
  PersonnelSchema,
  UnassignedPersonnel,
  UnassignedPersonnelSchema,
} from "@/server/types/personnel.type";
import { eq, sql } from "drizzle-orm";
import { MySqlQueryResult } from "drizzle-orm/mysql2";

export class PersonnelRepository implements IPersonnelRepository {
  async findUnassignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedPersonnel[] | PaginatedUnassignedPersonnel> {
    const isPaginated = page !== 0 && limit !== 0;

    // 1. Fetch all employees (unpaginated)
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`CALL sp_get_all_commercial_employees(${query})`,
    );

    const employees = UnassignedPersonnelSchema.array().parse(rawEmployees);

    // 2. Fetch assigned personnel
    const stmt = db.select().from(personnel).prepare("get_all_assigned_personnel");
    const assignedPersonnel = await stmt.execute();

    // 3. Build a Map of employeeId => assigned personnel record
    const assignedMap = new Map(assignedPersonnel.map((p) => [p.employeeId, p]));

    // 4. Filter employees to only those NOT in assignedMap (unassigned)
    const unassignedEmployees = employees.filter(
      (emp: UnassignedPersonnel) => !assignedMap.has(emp.employeeId),
    );

    // 5. Apply pagination if requested
    if (isPaginated) {
      return paginate(unassignedEmployees, page, limit);
    }

    // 6. Return full list if no pagination requested
    return unassignedEmployees;
  }

  async findAssignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedPersonnel[] | PaginatedAssignedPersonnel> {
    const isPaginated = page !== 0 && limit !== 0;

    // 1. Fetch all employees
    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`CALL sp_get_all_commercial_employees(${query})`,
    );

    const employees = UnassignedPersonnelSchema.array().parse(rawEmployees);

    // 2. Fetch assigned personnel
    const stmt = db
      .select()
      .from(personnelZoneBookView)
      .$dynamic()
      .prepare("get_all_personnel_zone_book_view");

    const executeStmt = await stmt.execute();

    const assignedPersonnel = PersonnelSchema.array().parse(executeStmt);

    const assignedMap = new Map(assignedPersonnel.map((p) => [p.employeeId, p]));

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

  async createPersonnel(data: CreateAssignedPersonnel): Promise<Personnel> {
    const { zoneBooks, ...rest } = data;

    const result = await db.transaction(async (tx) => {
      // Insert into personnel and return the created row
      const [insertPersonnel] = await tx.insert(personnel).values(rest).returning();

      // Bulk insert zoneBooks in one query
      await tx
        .insert(personnelZoneBook)
        .values(
          zoneBooks.map((item) => ({
            personnelId: insertPersonnel.id,
            ...item,
          })),
        )
        .returning();

      const [result] = await tx
        .select()
        .from(personnelZoneBookView)
        .where(eq(personnelZoneBookView.id, insertPersonnel.id));

      const parseResult = PersonnelSchema.parse(result);

      return parseResult;
    });

    return result;
  }

  async findPersonnelById(id: string): Promise<AssignedPersonnel> {
    const result = await db.select().from(personnelZoneBookView).where(eq(personnelZoneBookView.id, id));

    const [[rawEmployees]]: MySqlQueryResult = await hrmsDb.execute(
      sql`select * from all_employees_view where employee_id = ${id}`,
    );

    const employeeDetails = AssignedPersonnelSchema.parse(rawEmployees);

    return {
      ...employeeDetails,
      ...result,
    };
  }
}
