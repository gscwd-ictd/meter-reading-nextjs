import { consumerDetailsView } from "@mr/server/db/schemas/consumer";
import { IConsumerRepository } from "@mr/server/interfaces/consumer/consumer.interface.repository";
import { ScheduleReadingAccount, ScheduleReadingAccountSchema } from "@mr/server/types/consumer.type";
import { and, eq } from "drizzle-orm";
import db from "@mr/server/db/connections";

export class ConsumerRepository implements IConsumerRepository {
  async findConsumerDetails(meterReaderId: string): Promise<ScheduleReadingAccount> {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const result = await db.pgConn
      .select()
      .from(consumerDetailsView)
      .where(
        and(
          eq(consumerDetailsView.meterReaderId, meterReaderId),
          //MM-dd-yyyy
          eq(consumerDetailsView.readingDate, "09-01-2025"),
        ),
      );

    return ScheduleReadingAccountSchema.parse(result[0]);
  }
}
