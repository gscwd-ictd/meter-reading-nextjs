import { toast } from "sonner";
import { Concessionaire } from "../types/concessionaire";
import { TextMessage, TextMessageStatus } from "../types/text-message";
import { createTextMessage } from "./createTextMessage";
import { generateMessageTemplate } from "./generateMessageTemplate";

export async function sendMessageToRecipients(recipients: Concessionaire[]): Promise<{
  successful: TextMessage[];
  failed: TextMessage[];
}> {
  const successful: TextMessage[] = [];
  const failed: TextMessage[] = [];

  for (const recipient of recipients) {
    const message = generateMessageTemplate(recipient);

    try {
      const mockSuccess = Math.random() > 0.5;

      if (mockSuccess) {
        const successMsg = createTextMessage(recipient, message, true, TextMessageStatus.SENT);
        successful.push(successMsg);
      } else {
        const failedMsg = createTextMessage(recipient, message, false, TextMessageStatus.FAILED);
        failed.push(failedMsg);
      }
    } catch (error) {
      toast.error("Error", {
        description: `Message failed with error: ${error}`,
      });
      failed.push(createTextMessage(recipient, message, false, TextMessageStatus.FAILED));
    }
  }

  return { successful, failed };
}
