"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { Tabs, TabsContent } from "@mr/components/ui/Tabs";
import { SelectRestDayCombobox } from "./SelectRestDayCombobox";
import ZoneBookSelector from "../zonebook/ZonebookSelector";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";

export const MeterReaderTabs: FunctionComponent = () => {
  const [hasSetInitialZonebookPool, setHasSetInitialZonebookPool] = useState<boolean>(false);
  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const setFilteredZonebooks = useZonebookStore((state) => state.setFilteredZonebooks);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-zonebooks"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`);
        return res.data;
      } catch (error) {
        return error;
      }
    },
    enabled: !hasSetInitialZonebookPool,
  });

  // this useEffect should only run once and only when
  useEffect(() => {
    if (data && !hasSetInitialZonebookPool) {
      setFilteredZonebooks(data);
      setHasSetInitialZonebookPool(true);
    }
  }, [data, hasSetInitialZonebookPool, setFilteredZonebooks]);

  return (
    <Tabs defaultValue="info" className="w-full">
      {/* Info */}
      <TabsContent value="info">
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
                ID No
              </Label>
              <Input
                id="companyId"
                className="col-span-3"
                disabled
                defaultValue={selectedEmployee !== undefined ? selectedEmployee.companyId : ""}
              />
            </div>

            <div className="col-span-2 flex flex-col items-start gap-0">
              <Label htmlFor="mobileNumber" className="text-left text-sm font-medium text-gray-700">
                Contact Number
              </Label>
              <Input
                id="mobileNumber"
                className="col-span-3"
                disabled
                defaultValue={selectedEmployee !== undefined ? selectedEmployee.mobileNumber : ""}
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
              <ZoneBookSelector isLoading={isLoading} />
              <Input
                id="meterReaderZonebooks"
                className="w-full cursor-default truncate hover:cursor-pointer"
                readOnly
                onClick={() => setZonebookSelectorIsOpen(true)}
                value={
                  meterReaderZonebooks !== undefined
                    ? meterReaderZonebooks.map((mrzb) => mrzb.zoneBook)
                    : "Empty"
                }
              />
            </div>
            <SelectRestDayCombobox />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
