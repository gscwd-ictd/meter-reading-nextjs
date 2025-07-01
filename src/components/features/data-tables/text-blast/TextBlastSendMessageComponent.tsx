"use client";

import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateMessageTemplate } from "@/lib/utils/generateMessageTemplate";
import { sendMessageToRecipients } from "@/lib/utils/sendMessageToRecipients";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const TextBlastSendMessageComponent = () => {
  const [message, setMessage] = useState("");
  const [hasSent, setHasSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedRecipients = useTextBlastStore((state) => state.selectedRecipients);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  const setSelectedZone = useTextBlastStore((state) => state.setSelectedZone);
  const setSelectedBook = useTextBlastStore((state) => state.setSelectedBook);
  const setSelectedBillMonthYear = useTextBlastStore((state) => state.setSelectedBillMonthYear);

  useEffect(() => {
    if (selectedRecipients.length > 0) {
      const firstRecipient = selectedRecipients[0];
      const defaultMessage = generateMessageTemplate(firstRecipient);
      setMessage(defaultMessage);
      setHasSent(false);
    } else {
      setMessage("");
    }
  }, [selectedRecipients]);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Error", { description: "Please enter message first" });
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.info("Info", { description: "No recipients selected" });
      return;
    }

    setIsSending(true);

    try {
      const failedRecipients = selectedRecipients.map((msg) => ({
        consumerId: msg.consumerId,
        accountNo: msg.accountNo,
        concessionaireName: msg.concessionaireName,
        primaryContactNumber: msg.primaryContactNumber,
        billedAmount: msg.billedAmount,
        billMonthYear: msg.billMonthYear,
        dueDate: msg.dueDate,
        disconnectionDate: msg.disconnectionDate,
        zone: msg.zone,
        book: msg.book,
        dateCreated: msg.dateCreated,
        dateUpdated: msg.dateUpdated,
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

      setHasSent(true);
      setMessage("");
      setSelectedZone("");
      setSelectedBook("");
      setSelectedBillMonthYear(null);

      if (results.successful.length > 0) {
        toast.success("Success", {
          description: `Sent ${results.successful.length} messages`,
        });
      }

      if (results.failed.length > 0) {
        toast.error("Error", {
          description: `${results.failed.length} ${results.failed.length > 1 ? "messages" : "message"} failed to send`,
        });
      }
    } catch (error) {
      toast.error("Error", { description: `Failed to send messages: ${error}` });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={"Type your message here..."}
        rows={6}
        disabled={true}
        className="resize-none"
      />
      <div className="mt-2 flex items-center justify-end">
        <Button
          onClick={handleSend}
          disabled={!message.trim() || selectedRecipients.length === 0 || hasSent || isSending}
        >
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
};
