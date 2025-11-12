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
    <>
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

      <h3 className="mt-5 text-xl font-bold">Text Blast</h3>
      <div className="text-base font-medium text-gray-400">Send Water Bill to Concessionaires</div>

      <div className="mt-4 h-[90%] min-w-full rounded-lg border-2 border-gray-300">
        <div className="grid h-full grid-cols-3">
          <div className="col-span-2 h-full">
            <div className="grid grid-rows-3">
              <div className="row-span-2 h-full w-full border-2 border-t-0 border-r-0 border-l-0 border-gray-300">
                <TextBlastTableComponent />
              </div>
              <div className="m-4 h-full">
                <div className="h-[300px] overflow-scroll">
                  <TextBlastSendMessageComponent />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid grid-rows-2">
              {/* SENT */}
              <div className="border-2 border-t-0 border-r-0 border-l-0 border-gray-300">
                <SentMessageTableComponent />
              </div>
              {/* FAILED */}
              <div className="">
                <NotSentMessageTableComponent />
                <div className="m-4 flex justify-end">
                  <Button variant={"default"} className="w-fit">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
