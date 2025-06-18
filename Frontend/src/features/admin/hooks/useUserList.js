import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/userServiceAPI";

export const useUserList = ({ page = 1, pageSize = 10, search = "" }) => {
  return useQuery({
    queryKey: ["users", { page, pageSize, search }],
    queryFn: () => fetchUsers({ page, pageSize, search }),
    keepPreviousData: true,
  });
};
