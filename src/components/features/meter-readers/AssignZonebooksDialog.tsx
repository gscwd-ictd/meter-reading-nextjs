import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { Dialog, DialogContent, DialogHeader } from "@mr/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FunctionComponent, useEffect, useState } from "react";
import { Zonebook } from "@mr/lib/types/zonebook";
import { CircleXIcon } from "lucide-react";
import { ZonebookCombobox } from "../data-tables/zone-book/ZonebookCombobox";

export const AssignZonebooksDialog: FunctionComponent = () => {
  const zonebookDialogIsOpen = useSchedulesStore((state) => state.zonebookDialogIsOpen);
  const setZonebookDialogIsOpen = useSchedulesStore((state) => state.setZonebookDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const [meterReaderZonebooks, setMeterReaderZonebooks] = useState<Zonebook[]>([]);
  const [hasSetBooks, setHasSetBooks] = useState<boolean>(false);

  useEffect(() => {
    if (
      zonebookDialogIsOpen &&
      selectedMeterReader &&
      hasSetBooks === false &&
      selectedScheduleEntry?.meterReaders
    ) {
      setSelectedMeterReader({
        ...selectedMeterReader,
        zonebooks: selectedScheduleEntry.meterReaders.find(
          (mr) => mr.companyId === selectedMeterReader?.companyId
        )!.zonebooks,
      });

      setHasSetBooks(true);
    }
  }, [zonebookDialogIsOpen, selectedMeterReader, hasSetBooks]);

  const addNewZonebooksToMeterReader = (zonebook: Zonebook) => {
    const newMeterReaderZonebooks = [...selectedMeterReader!.zonebooks];

    newMeterReaderZonebooks.push(zonebook);

    if (selectedMeterReader !== null) {
      setSelectedMeterReader({
        ...selectedMeterReader,

        zonebooks: newMeterReaderZonebooks,
      });

      setMeterReaderZonebooks(newMeterReaderZonebooks);

      setSelectedZonebook(null);
    }
  };

  return (
    <Dialog
      open={zonebookDialogIsOpen}
      onOpenChange={() => {
        setZonebookDialogIsOpen(!open);
        setSelectedMeterReader(null);
      }}
      modal
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Assign Zone book</DialogTitle>
        </DialogHeader>

        <ZonebookCombobox />

        <Button
          onClick={() => addNewZonebooksToMeterReader(selectedZonebook!)}
          disabled={selectedZonebook !== null ? false : true}
        >
          Add this zonebook to list
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Zone-book</TableHead>
              <TableHead className="">Zone</TableHead>
              <TableHead className="">Book</TableHead>
              <TableHead className="">Area</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {selectedMeterReader && selectedMeterReader.zonebooks.length > 0 ? (
              selectedMeterReader.zonebooks.map((entry) => (
                <TableRow key={entry.zonebook}>
                  <TableCell>{entry.zonebook}</TableCell>
                  <TableCell>{entry.zone}</TableCell>
                  <TableCell>{entry.book}</TableCell>
                  <TableCell>{entry.area}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        const newMeterReaderZonebooks = selectedMeterReader.zonebooks.filter(
                          (zb) => zb.zonebook !== entry.zonebook
                        );

                        setMeterReaderZonebooks(newMeterReaderZonebooks);
                        setSelectedMeterReader({
                          ...selectedMeterReader,
                          zonebooks: newMeterReaderZonebooks,
                        });
                      }}
                    >
                      <CircleXIcon className="fill-red-600 text-white" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="w-full justify-center flex border">
                <TableCell colSpan={4}>No zonebooks found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Button
          variant="secondary"
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={selectedMeterReader?.zonebooks.length === 0 ? true : false}
          onClick={() => {
            if (selectedScheduleEntry && selectedMeterReader) {
              setSelectedScheduleEntry({
                ...selectedScheduleEntry,
                disconnectionDate: selectedScheduleEntry.disconnectionDate,
                dueDate: selectedScheduleEntry.dueDate,
                readingDate: selectedScheduleEntry.readingDate,
                meterReaders: selectedScheduleEntry.meterReaders!.map((mr) => {
                  if (selectedMeterReader && mr.companyId === selectedMeterReader?.companyId) {
                    return {
                      ...mr,
                      zonebooks: meterReaderZonebooks,
                    };
                  }
                  return mr;
                }),
              });
            }
            setZonebookDialogIsOpen(false);
            setSelectedMeterReader(null);
          }}
        >
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  );
};
