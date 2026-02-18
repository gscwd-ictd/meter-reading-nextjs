"use client";

import { Button } from "@mr/components/ui/Button";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home } from "lucide-react";
import { FunctionComponent } from "react";

type UnderMaintenanceComponentProps = {
  title: string;
};

export const UnderMaintenanceComponent: FunctionComponent<UnderMaintenanceComponentProps> = ({ title }) => {
  const router = useRouter();

  const handleGoToHomepage = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex min-h-[400px] w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-1 text-xl font-bold">
              <span className="text-blue-600">Metra</span>
              <span className="text-gray-400">X</span>
            </div>

            {/* Icon */}
            <div className="mb-6">
              <div className="rounded-full bg-gray-50 p-4">
                <AlertTriangle className="h-8 w-8 text-gray-500" />
              </div>
            </div>

            {/* Message */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-400">
                {title} is Under Maintenance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                We're currently upgrading this feature to serve you better. Please check back soon. Thank you
                for your patience.
              </p>
            </div>

            {/* Action Button */}
            <Button onClick={handleGoToHomepage} className="flex items-center gap-2 dark:text-white">
              <Home className="h-4 w-4" />
              <span>Go to Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
