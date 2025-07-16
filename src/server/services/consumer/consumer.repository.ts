import { db } from "@/server/db/postgres-connection";
import { consumerDetailsView } from "@/server/db/schemas/consumer";
import { IConsumerRepository } from "@/server/interfaces/consumer/consumer.interface.repository";
import { Consumer } from "@/server/types/consumer.type";
import { and, eq } from "drizzle-orm";

export class ConsumerRepository implements IConsumerRepository {
  async findConsumerDetails(meterReaderId: string): Promise<Consumer[]> {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const result = db
      .select()
      .from(consumerDetailsView)
      .where(
        and(
          eq(consumerDetailsView.meterReaderId, meterReaderId),
          eq(consumerDetailsView.readingDate, "2025-03-20"),
        ),
      );

    const [execute] = await result.execute();
    return execute;
  }
}
