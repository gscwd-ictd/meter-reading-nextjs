import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Employee } from "@mr/lib/types/personnel";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";

type EmployeesResponse = {
  items: Employee[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

const fetchEmployees = async (page: number): Promise<EmployeesResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_HRMS_BE}/employees/meter-reading/all-employees?page=${page}&limit=20`
  );
  return res.data;
};

export function usePaginatedEmployees(isDropdownOpen: boolean) {
  const [page, setPage] = useState(1);
  //   const [employees, setEmployees] = useState<Employee[]>([]);

  const employees = usePersonnelStore((state) => state.employees);
  const setEmployees = usePersonnelStore((state) => state.setEmployees);
  const [totalPages, setTotalPages] = useState(1);

  const query = useQuery({
    queryKey: ["employees", page, isDropdownOpen ? "open" : "closed"],
    queryFn: async () => await fetchEmployees(page),
    enabled: isDropdownOpen,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    retry: 1,
  });

  // Effect to handle merging new data
  useEffect(() => {
    if (query.data) {
      const { items, meta } = query.data;

      // Merge employees without duplication
      const newItems = items.filter((item) => !employees.some((e) => e.employeeId === item.employeeId));
      setEmployees([...employees, ...newItems]);

      setTotalPages(meta.totalPages);
    }
  }, [query.data]);

  // Optional: reset if dropdown is closed
  //   useEffect(() => {
  //     if (!isDropdownOpen) {
  //       setEmployees([]);
  //       setPage(1);
  //     }
  //   }, [isDropdownOpen]);

  useEffect(() => {
    if (isDropdownOpen && employees.length === 0 && page === 1) {
      query.refetch();
    }
  }, [isDropdownOpen, employees.length, page]);

  return {
    employees,
    isFetching: query.isFetching,
    hasNextPage: page < totalPages,
    fetchNextPage: () => setPage((prev) => Math.min(prev + 1, totalPages)),
    page,
  };
}
