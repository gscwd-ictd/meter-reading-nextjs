import { consumerDetailsView } from "@mr/server/db/schemas/consumer";
import { IConsumerRepository } from "@mr/server/interfaces/consumer/consumer.interface.repository";
import { ConsumerDetails } from "@mr/server/types/consumer.type";
import { eq } from "drizzle-orm";
import db from "@mr/server/db/connections";

export class ConsumerRepository implements IConsumerRepository {
  async findConsumerDetails(accountNumber: string): Promise<ConsumerDetails> {
    const result = await db.pgConn
      .select()
      .from(consumerDetailsView)
      .where(eq(consumerDetailsView.accountNumber, accountNumber));

    return result[0];
  }
}
