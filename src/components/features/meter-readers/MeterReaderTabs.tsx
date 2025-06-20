"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { AddSelectRestDayCombobox } from "./AddSelectRestDayCombobox";
import ZoneBookSelector from "../zonebook/ZonebookSelector";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Zonebook } from "@mr/lib/types/zonebook";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@mr/components/ui/FormInput";

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

  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-start gap-0">
          <Label htmlFor="name" className="text-left text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
            disabled
            defaultValue={selectedEmployee !== undefined ? selectedEmployee.name : ""}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 flex flex-col items-start gap-0">
            <Label htmlFor="companyId" className="text-left text-sm font-medium text-gray-700">
              Company ID No
            </Label>
            <Input
              id="companyId"
              className="col-span-3"
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.companyId : ""}
            />
          </div>

          <div className="col-span-2 flex flex-col items-start gap-0">
            <FormInput
              id="mobileNumber"
              label="Contact Number (+63)"
              isRequired
              minLength={10}
              maxLength={10}
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
            defaultValue={selectedEmployee !== undefined ? selectedEmployee.positionTitle : ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-start gap-0">
            <ZoneBookSelector loading={loading} />
            <Input
              id="meterReaderZonebooks"
              className="w-full cursor-default truncate hover:cursor-pointer"
              readOnly
              onClick={() => setZonebookSelectorIsOpen(true)}
              value={
                meterReaderZonebooks !== undefined
                  ? meterReaderZonebooks.map((mrzb: Zonebook) => mrzb.zoneBook)
                  : "Empty"
              }
            />
          </div>
          <AddSelectRestDayCombobox />
        </div>
      </div>
    </div>
  );
};
