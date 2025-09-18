import { Button } from "@mr/components/ui/Button";
import { FunctionComponent } from "react";

type MeterReaderEntryRemarkActionsProps = {
  remarks: string;
};

export const MeterReaderEntryRemarkActions: FunctionComponent<MeterReaderEntryRemarkActionsProps> = ({
  remarks,
}) => {
  return (
    <>
      {remarks !== undefined || remarks !== "" ? (
        <span className="text-muted-foreground text-xs">N/A</span>
      ) : (
        <Button onClick={() => console.log(remarks)}>{remarks}</Button>
      )}
    </>
  );
};
