import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { FunctionComponent, Suspense } from "react";
import { useAreaTextBlastColumns } from "./AreaTextBlastDataTableColumns";
import { AreaTextBlastDataTable } from "./AreaTextBlastDataTable";
import { format } from "date-fns";

export const AreaTextBlastTableComponent: FunctionComponent = () => {
  const concessionaires = useTextBlastStore((state) => state.concessionaires);
  const areaTextBlastColumns = useAreaTextBlastColumns(concessionaires);

  const selectedRecipients = useTextBlastStore((state) => state.selectedRecipients);
  const sentTextMessages = useTextBlastStore((state) => state.sentTextMessages);
  const notSentTextMessages = useTextBlastStore((state) => state.notSentTextMessages);
  const selectedZone = useTextBlastStore((state) => state.selectedZone);
  const selectedBook = useTextBlastStore((state) => state.selectedBook);
  const selectedBillMonthYear = useTextBlastStore((state) => state.selectedBillMonthYear);

  const getData = () => {
    if (!selectedZone && !selectedBook && !selectedBillMonthYear) {
      return [];
    }

    const sentIds = new Set(sentTextMessages.map((msg) => msg.consumerId));
    const failedIds = new Set(notSentTextMessages.map((msg) => msg.consumerId));

    if (selectedRecipients.length > 0) {
      return selectedRecipients.filter(
        (recipient) => !sentIds.has(recipient.consumerId) && !failedIds.has(recipient.consumerId),
      );
    }

    return concessionaires.filter((concessionaire) => {
      const matchesZone = !selectedZone || concessionaire.zone === Number(selectedZone);
      const matchesBook = !selectedBook || concessionaire.book === Number(selectedBook);
      const matchesMonth =
        !selectedBillMonthYear || concessionaire.billMonthYear === format(selectedBillMonthYear, "MM/yyyy");

      return (
        !sentIds.has(concessionaire.consumerId) &&
        !failedIds.has(concessionaire.consumerId) &&
        matchesZone &&
        matchesBook &&
        matchesMonth
      );
    });
  };

  const data = getData();

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <AreaTextBlastDataTable data={data ?? []} columns={areaTextBlastColumns} />
      </Suspense>
    </>
  );
};
