import { TextMessage } from "@/lib/types/text-blast/TextMessage";
import { toast } from "sonner";

export async function sendMessageToRecipients(
  recipients: TextMessage[],
): Promise<{ successful: TextMessage[]; failed: TextMessage[] }> {
  const successful: TextMessage[] = [];
  const failed: TextMessage[] = [];

  for (const recipient of recipients) {
    try {
      const mockSuccess = Math.random() > 0.5;
      if (mockSuccess) {
        successful.push(recipient);
      } else {
        failed.push(recipient);
      }
    } catch (error) {
      toast.error("Error", {
        description: `Message failed with error: ${error}`,
      });
      failed.push(recipient);
    }
  }

  return { successful, failed };
}
