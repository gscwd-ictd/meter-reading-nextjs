import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "../../typography/Heading";
import { AreaTextBlastTableComponent } from "./AreaTextBlastDataTable/AreaTextBlastTableComponent";
import { IndividualTextBlastTableComponent } from "./IndividualTextBlastDataTable/IndividualTextBlastTableComponent";

export default function TextBlastTableComponent() {
  return (
    <>
      <div>
        <Tabs defaultValue="area">
          <div className="p-3">
            <div className="flex flex-row items-center justify-between">
              <Heading variant={"h4"} className="text-primary">
                Consumers
              </Heading>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="individual">Individual</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <div className="flex h-full flex-col p-4">
            <TabsContent value={"area"}>
              <AreaTextBlastTableComponent />
            </TabsContent>
            <TabsContent value={"individual"}>
              <IndividualTextBlastTableComponent />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
