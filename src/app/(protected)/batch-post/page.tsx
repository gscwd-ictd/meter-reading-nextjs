"use client";

import { BatchPostTableComponent } from "@/components/features/data-tables/batch-post/BatchPostListDataTable/BatchPostListTableComponent";
import { BatchPostPostedTableComponent } from "@/components/features/data-tables/batch-post/BatchPostPostedDataTable/BatchPostPostedTableComponent";
import { useBatchPostStore } from "@/components/stores/useBatchPostStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { BatchPostStatus } from "@/lib/types/batch-post";
import { toast } from "sonner";

export default function BatchPostingPage() {
  const selectedConcessionaires = useBatchPostStore((state) => state.selectedConcessionaires);
  const setBatchPostPostedConcessionaires = useBatchPostStore(
    (state) => state.setBatchPostPostedConcessionaires,
  );
  const clearSelectedConcessionaires = useBatchPostStore((state) => state.clearSelectedConcessionaires);

  function handleClick() {
    if (selectedConcessionaires.length === 0) {
      toast.info("Info", { description: "No failed messages to resend" });
      return;
    }

    const posted = selectedConcessionaires.map((item) => ({
      ...item,
      status: BatchPostStatus.POSTED,
    }));

    setBatchPostPostedConcessionaires(posted);
    clearSelectedConcessionaires();

    toast.success("Success", {
      description: `${posted.length} ${posted.length > 1 ? "accounts" : "account"} successfully posted.`,
    });
  }

  return (
    <>
      <div className="flex h-full flex-col p-5">
        <div className="">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Batch Post</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h3 className="mt-5 text-xl font-bold">Batch Post</h3>
        <div className="text-base font-medium text-gray-400">Batch post read accounts for the month</div>
        <div className="mt-1 grid flex-1 grid-cols-3 border-1 border-gray-200">
          <div className="col-span-2 flex h-full flex-col justify-between border-1 border-t-0 border-b-0 border-l-0 border-gray-200">
            <div className="h-full p-3">
              <BatchPostTableComponent />
              <div className="flex justify-end">
                <Button
                  onClick={handleClick}
                  disabled={selectedConcessionaires.length === 0}
                  className="w-fit"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex h-full w-full flex-col">
            <div className="grid h-full min-h-full w-full">
              <div className="h-full w-full overflow-auto">
                <BatchPostPostedTableComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
