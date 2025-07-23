"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { Tabs, TabsContent } from "@mr/components/ui/tabs";
import { SelectRestDayCombobox } from "./SelectRestDayCombobox";

export const PersonnelTabs = () => {
  const selectedEmployee = usePersonnelStore((state) => state.selectedEmployee);

  return (
    <Tabs defaultValue="info" className="w-full ">
      {/* Info */}
      <TabsContent value="info">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 gap-2">
            <div className="flex flex-col items-start gap-0 col-span-3">
              <Label htmlFor="name" className="text-left text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3 "
                disabled
                defaultValue={selectedEmployee !== undefined ? selectedEmployee.name : ""}
              />
            </div>

            <div className="flex flex-col items-start gap-0 col-span-2">
              <Label htmlFor="companyId" className="text-left text-sm font-medium text-gray-700">
                ID No
              </Label>
              <Input
                id="companyId"
                className="col-span-3 "
                disabled
                defaultValue={selectedEmployee !== undefined ? selectedEmployee.companyId : ""}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-0">
            <Label htmlFor="positionTitle" className="text-left text-sm font-medium text-gray-700">
              Position Title
            </Label>
            <Input
              id="positionTitle"
              className="col-span-3 "
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.positionTitle : ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-start gap-0">
              <Label htmlFor="mobileNumber" className="text-left text-sm font-medium text-gray-700">
                Contact Number
              </Label>
              <Input
                id="mobileNumber"
                className="col-span-3 "
                disabled
                defaultValue={selectedEmployee !== undefined ? selectedEmployee.mobileNumber : ""}
              />
            </div>

            <SelectRestDayCombobox />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
