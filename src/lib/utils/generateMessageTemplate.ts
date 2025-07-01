import { format } from "date-fns";
import { Concessionaire } from "../types/concessionaire";

export function generateMessageTemplate(recipient: Concessionaire): string {
  const formattedBill = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(recipient.billedAmount);

  const message = `Dear ${recipient.concessionaireName}, Your water bill amount is ${formattedBill} for ${recipient.billMonthYear}. Due date: ${format(recipient.dueDate, "MM/dd/yyyy")}. Please pay before ${format(recipient.disconnectionDate, "MM/dd/yyyy")} to avoid disconnection. Thank you.`;

  return message;
}
