"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { FunctionComponent } from "react";
import { useFormContext } from "react-hook-form";
import { EditSelectRestDayCombobox } from "./EditSelectRestDayCombobox";
import { ContactNumberInput } from "@mr/components/ui/input/ContactNumberInput";
import EditZonebookSelector from "../zonebook/EditZonebookSelector";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";

type EditMeterReaderTabsProps = {
  zonebookIsLoading: boolean;
  meterReaderIsLoading: boolean;
};

export const EditMeterReaderTabs: FunctionComponent<EditMeterReaderTabsProps> = ({
  zonebookIsLoading,
  meterReaderIsLoading,
}) => {
  const selectedMeterReader = useMeterReadersStore((state) => state.selectedMeterReader);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);
  const mobileNumber = useMeterReadersStore((state) => state.mobileNumber);
  const setMobileNumber = useMeterReadersStore((state) => state.setMobileNumber);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      {meterReaderIsLoading && (
        <div className="flex w-full justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-start gap-0">
          <Label htmlFor="name" className="text-left text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
            defaultValue={selectedMeterReader !== undefined ? selectedMeterReader.name : ""}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 flex flex-col items-start gap-0">
            <Label htmlFor="companyId" className="text-left text-sm font-medium text-gray-700">
              ID No
            </Label>
            <Input
              id="companyId"
              className="col-span-3"
              disabled
              defaultValue={selectedMeterReader !== undefined ? selectedMeterReader.companyId : ""}
            />
          </div>

          <div className="col-span-2 flex flex-col items-start gap-0">
            <ContactNumberInput
              id="mobileNumber"
              label="Contact Number"
              minLength={11}
              maxLength={11}
              disabled={meterReaderIsLoading ? true : false}
              controller={{
                ...register("mobileNumber", {
                  value: mobileNumber,
                  onChange: (e) => setMobileNumber(e.target.value),
                }),
              }}
              isError={errors.mobileNumber ? true : false}
              errorMessage={errors.mobileNumber?.message?.toString()}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-0">
          <Label htmlFor="positionTitle" className="text-left text-sm font-medium text-gray-700">
            Position Title
          </Label>
          <Input
            id="positionTitle"
            className="col-span-3"
            disabled
            defaultValue={selectedMeterReader !== undefined ? selectedMeterReader.positionTitle : ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-start gap-0">
            <EditZonebookSelector loading={zonebookIsLoading} />

            <Input
              id="meterReaderZonebooks"
              className="w-full cursor-default truncate hover:cursor-pointer"
              readOnly
              disabled={meterReaderIsLoading ? true : false}
              onClick={() => setZonebookSelectorIsOpen(true)}
              value={
                meterReaderZonebooks !== undefined
                  ? meterReaderZonebooks.map((mrzb) => mrzb.zoneBook)
                  : "Empty"
              }
            />
          </div>
          <EditSelectRestDayCombobox />
        </div>
      </div>
    </div>
  );
};
