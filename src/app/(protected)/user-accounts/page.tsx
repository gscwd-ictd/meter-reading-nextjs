import { UserAccountsDataTable } from "@mr/components/features/data-tables/user-accounts/UserAccountsDataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function UsersPage() {
  return (
    <div className="flex h-full flex-col p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h3 className="mt-5 text-xl font-bold">User Accounts</h3>
      <div className="mb-1 text-base font-medium text-gray-400">List of Users</div>
      <UserAccountsDataTable />
    </div>
  );
}
