import { TextMessageData, TextMessageStatus } from "@/lib/types/text-blast/TextMessage";

export const SampleTextBlastReportData: TextMessageData[] = [
  {
    textMessageId: "ad4108b5-0dac-4a0a-a8d4-630e94c59270",
    dateCreated: "2025-06-12T00:00:00",
    accountNumber: "334455-6",
    consumerName: "Ricardo Narvaiza",
    contactNumber: "639281234567",
    message:
      "Hi RICARDO NARVAIZA account # 334455-6. Your current bill of 1750.75 will due on 06/12/2025, disc date on 06/27/2025. Kindly settle your bill before the due date to avoid disconnection. ACCOUNTS WITH ARREARS WILL NOT BE ACCEPTED AT PAYMENT CENTERS. Thank you.",
    status: TextMessageStatus.FAILED,
  },
  {
    textMessageId: "bb564e6a-043e-46b6-a23d-f9fde8bec2a4",
    dateCreated: "2025-06-13T00:00:00",
    accountNumber: "334456-7",
    consumerName: "Ricardo Vicente Narvaiza",
    contactNumber: "639281234568",
    message:
      "Hi RICARDO VICENTE NARVAIZA account # 334456-7. Your current bill of 1751.75 will due on 06/13/2025, disc date on 06/28/2025. Kindly settle your bill before the due date to avoid disconnection. ACCOUNTS WITH ARREARS WILL NOT BE ACCEPTED AT PAYMENT CENTERS. Thank you.",
    status: TextMessageStatus.SENT,
  },
];
