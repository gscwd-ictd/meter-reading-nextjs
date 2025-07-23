"use client";

import { SentMessageTableComponent } from "@/components/features/data-tables/text-blast/SentMessageDataTable/SentMessageTableComponent";
import { NotSentMessageTableComponent } from "@/components/features/data-tables/text-blast/NotSentMessageDataTable/NotSentMessageTableComponent";
import { TextBlastSendMessageComponent } from "@/components/features/data-tables/text-blast/TextBlastSendMessageComponent";
import TextBlastTableComponent from "@/components/features/data-tables/text-blast/TextBlastTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { toast } from "sonner";
import { sendMessageToRecipients } from "@/lib/utils/text-blast/sendMessageToRecipients";
import { TextMessageStatus } from "@/lib/types/text-blast/TextMessage";

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
        ...msg,
        status: TextMessageStatus.FAILED,
      }));

      const result = await sendMessageToRecipients(failedRecipients);

      const successful = result.successful.map((s) => ({
        ...s,
        status: TextMessageStatus.SENT,
      }));

      const failed = result.failed.map((f) => ({
        ...f,
        status: TextMessageStatus.FAILED,
      }));

      setTextMessages(successful, failed);

      const processedContactNumbers = [
        ...successful.map((r) => r.contactNumber),
        ...failed.map((r) => r.contactNumber),
      ];

      useTextBlastStore.setState((state) => ({
        consumers: state.consumers.filter((c) => !processedContactNumbers.includes(c.contactNumber)),
        selectedConsumers: state.selectedConsumers.filter(
          (r) => !processedContactNumbers.includes(r.contactNumber),
        ),
      }));

      if (successful.length > 0) {
        toast.success("Success", {
          description: `Resent ${successful.length} message(s)`,
        });
      }

      if (failed.length > 0) {
        toast.error("Error", {
          description: `${failed.length} message(s) failed to send`,
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
        <div className="text-muted-foreground text-base font-medium">Send Water Bill to Consumers</div>
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
                    Resend
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
