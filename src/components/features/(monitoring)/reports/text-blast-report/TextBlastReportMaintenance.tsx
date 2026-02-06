"use client";

import { Button } from "@mr/components/ui/Button";
import { useRouter } from "next/navigation";

export const TextBlastReportMaintenance = () => {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-1 justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col gap-4 rounded-lg border p-10">
          <div className="flex w-full items-center justify-center gap-0 text-lg">
            <span className="text-primary flex font-black">Metra</span>
            <span className="font-black text-slate-500">X</span>
          </div>
          <div className="flex max-w-sm flex-col">
            <span className="text-primary/80 text-xl font-semibold">
              Text Blast Report is under maintenance
            </span>
            <span className="text-sm text-gray-600">
              We're preparing to serve you better. Please come back later. Thank you for your patience.
            </span>
          </div>

          <Button role="link" onClick={() => router.push("/dashboard")} type="button">
            <span className="items-center">Go to Homepage &#8594; </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
