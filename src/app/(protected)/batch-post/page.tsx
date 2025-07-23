"use client";

// import { BatchPostDialog } from "@/components/features/batch-post/BatchPostDialog";
// import { BatchPostPostedTableComponent } from "@/components/features/data-tables/batch-post/BatchPostPostedDataTable/BatchPostPostedTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogTrigger } from "@/components/ui/Dialog";

export default function BatchPostingPage() {
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
        <div className="text-muted-foreground text-base font-medium">
          Batch post read accounts for the month
        </div>
        <div className="">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-2">Manage Posting</Button>
              </DialogTrigger>
              {/* <BatchPostDialog /> */}
            </Dialog>
          </div>
          {/* <BatchPostPostedTableComponent /> */}
        </div>
      </div>
    </>
  );
}
