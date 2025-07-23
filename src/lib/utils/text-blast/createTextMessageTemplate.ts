import { AccountWithDates } from "@/lib/types/text-blast/ReadingDetails";
import { TextMessageStatus } from "@/lib/types/text-blast/TextMessage";
import { format } from "date-fns";

export function createTextMessageTemplate(readingDetails: AccountWithDates): {
  message: string;
  contactNumber: string | null;
  accountNumber: string;
  consumerName: string;
  status: TextMessageStatus;
} {
  const message = `Hi ${readingDetails.consumerName.toUpperCase()} account # ${readingDetails.accountNumber}-${readingDetails.consumerType}. Your current bill of ${readingDetails.waterBalance} will due on ${format(readingDetails.dueDate, "MM/dd/yyyy")}, disc date on ${format(readingDetails.disconnectionDate, "MM/dd/yyyy")}. Kindly settle your bill before the due date to avoid disconnection. ACCOUNTS WITH ARREARS WILL NOT BE ACCEPTED AT PAYMENT CENTERS. Thank you.`;
  const contactNumber = readingDetails.contactNumber;
  const accountNumber = readingDetails.accountNumber;
  const consumerName = readingDetails.consumerName;
  const status = TextMessageStatus.PENDING;

  return { message, contactNumber, accountNumber, consumerName, status };
}