import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { DeleteAreaDialog } from "./DeleteAreaDialog";

type AreaRowActionsProps = {
  details: {
    area: string;
    areaId: string;
  };
};

export const AreaRowActions: FunctionComponent<AreaRowActionsProps> = ({ details }) => {
  const setEditAreaDialogIsOpen = useZonebookStore((state) => state.setEditAreaDialogIsOpen);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  return (
    <>
      <div className="flex gap-2">
        <SquarePenIcon
          className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer"
          role="button"
          onClick={() => {
            setEditAreaDialogIsOpen(true);
            setSelectedArea(details);
          }}
        />
        {/* <TrashIcon
          className="text-primary size-8 rounded bg-blue-100 p-2 hover:cursor-pointer"
          role="button"
        /> */}
        <DeleteAreaDialog area={details} />
      </div>
    </>
  );
};
