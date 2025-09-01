import { NotSentMessageTableComponent } from "@mr/components/features/data-tables/text-blast/NotSentMessageDataTable/NotSentMessageTableComponent";
import { SentMessageTableComponent } from "@mr/components/features/data-tables/text-blast/SentMessageDataTable/SentMessageTableComponent";
import TextBlastSendMessageComponent from "@mr/components/features/data-tables/text-blast/TextBlastSendMessageComponent";
import TextBlastTableComponent from "@mr/components/features/data-tables/text-blast/TextBlastTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import { Button } from "@mr/components/ui/Button";

export default function TextBlastPage() {
  return (
    <div className="h-full flex flex-col p-5">
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Text Blast</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h3 className="font-bold text-xl mt-5">Text Blast</h3>
      <div className="font-medium text-base text-gray-400">Send Water Bill to Concessionaires</div>

      <div className="h-[90%] min-w-full mt-4 border-2 border-gray-300 rounded-lg">
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-2 h-full">
            <div className="grid grid-rows-3">
              <div className="row-span-2 h-full w-full border-2 border-gray-300 border-l-0 border-t-0 border-r-0">
                <TextBlastTableComponent />
              </div>
              <div className="h-full m-4">
                <div className="h-[300px] overflow-scroll">
                  <TextBlastSendMessageComponent />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid grid-rows-2">
              {/* SENT */}
              <div className="border-2 border-gray-300 border-t-0 border-l-0 border-r-0">
                <SentMessageTableComponent />
              </div>
              {/* FAILED */}
              <div className="">
                <NotSentMessageTableComponent />
                <div className="flex justify-end m-4">
                  <Button variant={"default"} className="w-fit">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
