"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { AddSelectRestDayCombobox } from "./AddSelectRestDayCombobox";
import ZoneBookSelector from "../zonebook/ZonebookSelector";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { FunctionComponent } from "react";
import { Zonebook } from "@mr/lib/types/zonebook";
import { useFormContext } from "react-hook-form";
import { ContactNumberInput } from "@mr/components/ui/input/ContactNumberInput";

type MeterReaderTabsProps = {
  loading: boolean;
};

export const MeterReaderTabs: FunctionComponent<MeterReaderTabsProps> = ({ loading }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const mobileNumber = useMeterReadersStore((state) => state.mobileNumber);
  const setMobileNumber = useMeterReadersStore((state) => state.setMobileNumber);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);

  const hasSelectedEmployee = selectedEmployee !== undefined;

  const formatZonebooks = () => {
    if (!meterReaderZonebooks || meterReaderZonebooks.length === 0) return "No zone books assigned";
    if (meterReaderZonebooks.length === 1) return meterReaderZonebooks[0].zoneBook;
    return `${meterReaderZonebooks.length} zone books`;
  };

  return (
    <div className="space-y-5 py-2">
      {/* Employee Name - Full width */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="name"
          disabled
          defaultValue={hasSelectedEmployee ? selectedEmployee.name : ""}
          className="bg-gray-50"
          placeholder="No employee selected"
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
            defaultValue={hasSelectedEmployee ? selectedEmployee.companyId : ""}
            className="bg-gray-50 font-mono text-sm"
            placeholder="—"
          />
        </div>

        <div className="space-y-1.5">
          <ContactNumberInput
            id="mobileNumber"
            label="Contact Number"
            isRequired
            minLength={11}
            maxLength={11}
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
          defaultValue={hasSelectedEmployee ? selectedEmployee.positionTitle : ""}
          className="bg-gray-50"
          placeholder="—"
        />
      </div>

      {/* Zone Books and Rest Days - Two columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <ZoneBookSelector loading={loading} />

          <div
            className={`border-input bg-background ring-offset-background relative flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
              hasSelectedEmployee ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => hasSelectedEmployee && setZonebookSelectorIsOpen(true)}
          >
            <span className="truncate">
              {!hasSelectedEmployee ? "Select an employee first" : formatZonebooks()}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <AddSelectRestDayCombobox />
        </div>
      </div>
    </div>
  );
};
