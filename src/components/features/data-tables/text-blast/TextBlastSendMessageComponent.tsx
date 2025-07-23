"use client";

import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { TextMessage, TextMessageStatus } from "@/lib/types/text-blast/TextMessage";
import { createTextMessageTemplate } from "@/lib/utils/text-blast/createTextMessageTemplate";
import { sendMessageToRecipients } from "@/lib/utils/text-blast/sendMessageToRecipients";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const TextBlastSendMessageComponent = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<Omit<TextMessage, "contactNumber">>();

  const message = watch("message");

  const selectedConsumers = useTextBlastStore((state) => state.selectedConsumers);

  const setSelectedZone = useTextBlastStore((state) => state.setSelectedZone);
  const setSelectedBook = useTextBlastStore((state) => state.setSelectedBook);
  const setSelectedBillMonthYear = useTextBlastStore((state) => state.setSelectedBillMonthYear);

  const clearSelectedConsumers = useTextBlastStore((state) => state.clearSelectedConsumers);
  const setTextMessageRecipients = useTextBlastStore((state) => state.setTextMessageRecipients);

  const setSentTextMessages = useTextBlastStore((state) => state.setSentTextMessages);
  const setNotSentTextMessages = useTextBlastStore((state) => state.setNotSentTextMessages);

  useEffect(() => {
    if (selectedConsumers.length > 0) {
      const firstRecipient = selectedConsumers[0];
      const defaultMessage = createTextMessageTemplate(firstRecipient);
      setValue("message", defaultMessage.message);
    } else {
      reset({ message: "" });
    }
  }, [reset, selectedConsumers, setValue]);

  const onSubmit = async (data: Omit<TextMessage, "contactNumber">) => {
    if (!data.message.trim()) {
      toast.error("Error", { description: "Please enter message first" });
      return;
    }

    if (selectedConsumers.length === 0) {
      toast.info("Info", { description: "No recipients selected" });
      return;
    }

    try {
      const recipients = selectedConsumers
        // .filter((consumer) => consumer.contactNumber)
        .map((consumer) => createTextMessageTemplate(consumer));

      setTextMessageRecipients(recipients);
      const result = await sendMessageToRecipients(recipients);

      const successful = result.successful.map((s) => ({
        ...s,
        status: TextMessageStatus.SENT,
      }));

      const failed = result.failed.map((f) => ({
        ...f,
        status: TextMessageStatus.FAILED,
      }));

      setSentTextMessages(successful);
      setNotSentTextMessages(failed);

      if (successful.length > 0) {
        toast.success("Success", {
          description: `Sent message to ${successful.length} consumer(s)`,
        });
      }

      if (failed.length > 0) {
        toast.error("Error", {
          description: `${failed.length} message(s) failed to send`,
        });
      }

      reset();
      setSelectedZone("");
      setSelectedBook("");
      setSelectedBillMonthYear(null);
      setTextMessageRecipients([]);
      clearSelectedConsumers();
    } catch (error) {
      toast.error("Error", {
        description: `Failed to send: ${error}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <Textarea
        {...register("message")}
        value={message}
        placeholder={"Message here..."}
        rows={6}
        disabled={true}
        className="resize-none"
      />
      <div className="mt-2 flex items-center justify-end">
        <Button type="submit" disabled={selectedConsumers.length === 0}>
          Send Message
        </Button>
      </div>
    </form>
  );
};
