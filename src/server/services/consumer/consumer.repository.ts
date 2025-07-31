import { consumerDetailsView } from "@mr/server/db/schemas/consumer";
import { IConsumerRepository } from "@mr/server/interfaces/consumer/consumer.interface.repository";
import { Consumer } from "@mr/server/types/consumer.type";
import { and, eq } from "drizzle-orm";
import db from "@mr/server/db/connections";

export class ConsumerRepository implements IConsumerRepository {
  async findConsumerDetails(meterReaderId: string): Promise<Consumer[]> {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const result = await db.pgConn
      .select()
      .from(consumerDetailsView)
      .where(
        and(
          eq(consumerDetailsView.meterReaderId, meterReaderId),
          eq(consumerDetailsView.readingDate, "04-18-2025"),
        ),
      );

    return result;
  }
}
