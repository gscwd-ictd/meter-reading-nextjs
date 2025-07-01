"use client";

import { SentMessageTableComponent } from "@/components/features/data-tables/text-blast/SentMessageDataTable/SentMessageTableComponent";
import { NotSentMessageTableComponent } from "@/components/features/data-tables/text-blast/NotSentMessageDataTable/NotSentMessageTableComponent";
import { TextBlastSendMessageComponent } from "@/components/features/data-tables/text-blast/TextBlastSendMessageComponent";
import TextBlastTableComponent from "@/components/features/data-tables/text-blast/TextBlastTableComponent";
import { sendMessageToRecipients } from "@/lib/utils/sendMessageToRecipients";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function TextBlastPage() {
  const notSentTextMessages = useTextBlastStore((state) => state.notSentTextMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  const handleResend = async () => {
    if (notSentTextMessages.length === 0) {
      toast.info("Info", { description: "No failed messages to resend" });
      return false;
    }

    try {
      const failedRecipients = notSentTextMessages.map((msg) => ({
        consumerId: msg.consumerId,
        accountNo: msg.accountNo,
        concessionaireName: msg.concessionaireName,
        primaryContactNumber: msg.primaryContactNumber,
        billedAmount: msg.billedAmount,
        billMonthYear: msg.billMonthYear,
        dueDate: msg.dueDate,
        disconnectionDate: msg.disconnectionDate,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      }));

      const results = await sendMessageToRecipients(failedRecipients);

      setTextMessages(results.successful, results.failed);

      const processedIds = [
        ...results.successful.map((r) => r.consumerId),
        ...results.failed.map((r) => r.consumerId),
      ];

      useTextBlastStore.setState((state) => ({
        concessionaires: state.concessionaires.filter((c) => !processedIds.includes(c.consumerId)),
        selectedRecipients: state.selectedRecipients.filter((r) => !processedIds.includes(r.consumerId)),
      }));

      if (results.successful.length > 0) {
        toast.success("Success", {
          description: `Resent ${results.successful.length} ${results.successful.length > 1 ? "messages" : "message"}`,
        });
      }

      if (results.failed.length > 0) {
        toast.error("Error", {
          description: `${results.failed.length} ${results.failed.length > 1 ? "messages" : "message"} failed to send`,
        });
      }
    } catch (error) {
      toast.error("Error", { description: `Failed to resend messages: ${error}` });
    }
  };

  return (
    <>
      <div className="flex h-full flex-col p-5">
        <div className="">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Text Blast</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h3 className="mt-5 text-xl font-bold">Text Blast</h3>
        <div className="text-base font-medium text-gray-400">Send Water Bill to Concessionaires</div>
        <div className="mt-1 grid flex-1 grid-cols-3 border-1 border-gray-200">
          <div className="col-span-2 flex h-full flex-col justify-between border-1 border-t-0 border-b-0 border-l-0 border-gray-200">
            <div className="h-full">
              <TextBlastTableComponent />
              <TextBlastSendMessageComponent />
            </div>
          </div>
          <div className="col-span-1 flex h-full w-full flex-col">
            <div className="grid h-full min-h-full w-full grid-rows-2">
              <div className="h-full w-full overflow-auto border-b-2 border-gray-200">
                <SentMessageTableComponent />
              </div>
              <div className="h-full w-full overflow-auto">
                <NotSentMessageTableComponent />
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    className="w-fit"
                    onClick={handleResend}
                    disabled={notSentTextMessages.length === 0}
                  >
                    Resend ({notSentTextMessages.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
