import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { Zonebook } from "@mr/lib/types/zonebook";
import { PlusIcon, SquarePenIcon } from "lucide-react";
import { FunctionComponent } from "react";

type ZonebookRowActionsProps = {
  zonebook: Zonebook;
};

export const ZonebookRowActions: FunctionComponent<ZonebookRowActionsProps> = ({ zonebook }) => {
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);
  const setAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.setAssignAreaZonebookDialogIsOpen,
  );
  const setEditAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.setEditAssignAreaZonebookDialogIsOpen,
  );

  return (
    <div className="flex gap-2">
      {!zonebook.id && (
        <PlusIcon
          className="text-primary size-8 rounded bg-gray-200 p-2 hover:cursor-pointer"
          role="button"
          onClick={() => {
            setSelectedZonebook(zonebook);
            setAssignAreaZonebookDialogIsOpen(true);
          }}
        />
      )}
      {zonebook.id && (
        <SquarePenIcon
          className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer"
          role="button"
          onClick={() => {
            setSelectedZonebook(zonebook);
            setEditAssignAreaZonebookDialogIsOpen(true);
          }}
        />
      )}
    </div>
  );
};
