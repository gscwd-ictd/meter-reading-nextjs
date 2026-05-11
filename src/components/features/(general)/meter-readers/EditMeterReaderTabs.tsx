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

  const hasSelectedReader = selectedMeterReader !== undefined;
  const isLoading = meterReaderIsLoading || zonebookIsLoading;

  const formatZonebooks = () => {
    if (!meterReaderZonebooks || meterReaderZonebooks.length === 0) return "No zone books assigned";
    if (meterReaderZonebooks.length === 1) return meterReaderZonebooks[0].zoneBook;
    return `${meterReaderZonebooks.length} Zonebooks`;
  };

  if (meterReaderIsLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="name"
          disabled
          defaultValue={hasSelectedReader ? selectedMeterReader.name : ""}
          className="bg-gray-50"
          placeholder="No meter reader selected"
        />
      </div>

      {/* Company ID and Contact Number - Two columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyId" className="text-sm font-medium text-gray-700">
            Company ID
          </Label>
          <Input
            id="companyId"
            disabled
            defaultValue={hasSelectedReader ? selectedMeterReader.companyId : ""}
            className="bg-gray-50 font-mono text-sm"
            placeholder="—"
          />
        </div>

        <div className="space-y-1.5">
          <ContactNumberInput
            id="mobileNumber"
            label="Contact Number"
            minLength={11}
            maxLength={11}
            disabled={!hasSelectedReader || isLoading}
            controller={{
              ...register("mobileNumber", {
                value: mobileNumber,
                onChange: (e) => setMobileNumber(e.target.value),
              }),
            }}
            isError={!!errors.mobileNumber}
            errorMessage={errors.mobileNumber?.message?.toString()}
          />
        </div>
      </div>

      {/* Position Title */}
      <div className="space-y-1.5">
        <Label htmlFor="positionTitle" className="text-sm font-medium text-gray-700">
          Position Title
        </Label>
        <Input
          id="positionTitle"
          disabled
          defaultValue={hasSelectedReader ? selectedMeterReader.positionTitle : ""}
          className="bg-gray-50"
          placeholder="—"
        />
      </div>

      {/* Zone Books and Rest Days - Two columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <EditZonebookSelector loading={zonebookIsLoading} />
          <div
            className={`border-input bg-background ring-offset-background relative flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
              hasSelectedReader && !isLoading
                ? "cursor-pointer hover:bg-gray-50"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => hasSelectedReader && !isLoading && setZonebookSelectorIsOpen(true)}
          >
            <span className="truncate">
              {!hasSelectedReader
                ? "Select a meter reader first"
                : isLoading
                  ? "Loading..."
                  : formatZonebooks()}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <EditSelectRestDayCombobox />
        </div>
      </div>
    </div>
  );
};
