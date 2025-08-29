import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2, FileX, Users, Unplug } from "lucide-react";

export const TotalConsumersCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["consumer-count"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/dashboard/consumer-counts`);
      return res.data;
    },
  });

  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardCard
          title="Active"
          icon={<CheckCircle2 className="text-emerald-600" />}
          className="border bg-emerald-200 dark:bg-gray-900"
          size="sm"
        >
          <div className="text-2xl font-bold text-green-500">
            {data && data.active ? data.active : <LoadingSpinner />}
          </div>
        </DashboardCard>
        <DashboardCard
          title="Disconnected"
          icon={<Unplug className="text-gray-600" />}
          className="border bg-gray-200 dark:bg-gray-900"
          size="sm"
        >
          <div className="text-2xl font-bold text-gray-700">
            {data && data.disconnected ? data.disconnected : <LoadingSpinner />}
          </div>
        </DashboardCard>
        <DashboardCard
          title="Write Off"
          icon={<FileX className="text-gray-600" />}
          className="border bg-gray-200 dark:bg-gray-900"
          size="sm"
        >
          <div className="text-2xl font-bold text-gray-700">
            {data && data.writeOff ? data.writeOff : <LoadingSpinner />}
          </div>
        </DashboardCard>
        <DashboardCard
          title="Total"
          icon={<Users className="text-primary" />}
          className="border bg-blue-200 dark:bg-gray-900"
          size="sm"
        >
          <div className="text-primary text-2xl font-bold">
            {data && data.total ? data.total : <LoadingSpinner />}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
