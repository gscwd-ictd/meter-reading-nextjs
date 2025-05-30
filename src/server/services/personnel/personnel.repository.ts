import { hrmsDb } from "@/server/db/mysql-connection";
import { IPersonnelRepository } from "@/server/interfaces/personnel/personnel.interface.repository";
import { Personnel, PersonnelSchema } from "@/server/types/personnel.type";
import { sql } from "drizzle-orm";
import { MySqlQueryResult } from "drizzle-orm/mysql2";

export class PersonnelRepository implements IPersonnelRepository {
  async findAllPersonnels(page: number, limit: number, query: string): Promise<Personnel[]> {
    const [[result]]: MySqlQueryResult = await hrmsDb.execute(
      sql`call sp_get_all_employees_paginated(${page},${limit},${query})`,
    );

    return PersonnelSchema.array().parse(result);
  }

  async findPersonnelById(id: string): Promise<Personnel> {
    const [result]: MySqlQueryResult = await hrmsDb.execute(
      sql`select employee_id as employeeId, company_id as companyId, name, position_title as positionTitle,
       assignment, mobile_number as mobileNumber, photo_url as photoUrl from all_employees_view where employee_id = ${id}`,
    );

    if (!result[0]) {
      throw new Error(`Personnel with employee id ${id} not found.`);
    }

    return PersonnelSchema.parse(result[0]);
  }
}
