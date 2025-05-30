import { FunctionComponent } from "react";
import { Label } from "@mr/components/ui/Label";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Combobox } from "@mr/components/ui/Combobox";

const data = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
];


export const ZoneBookMonthDropdown: FunctionComponent = () => {

  return (
    <div className="mb-4 flex flex-row justify-between">
      <Combobox data={data ?? []} text={"Zone"} />
      <Combobox data={data ?? []} text={"Book"} />
      <div className="flex flex-row gap-1">
        <Label htmlFor="billMonth" className="whitespace-nowrap">
          Bill Month
        </Label>
        <Input type="date" name="billMonth" />
      </div>
      <Button variant={"default"} className="w-fit">
        Load
      </Button>
    </div>
  );
};
