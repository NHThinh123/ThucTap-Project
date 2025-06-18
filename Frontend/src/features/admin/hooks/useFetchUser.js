import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../services/userServiceAPI";

export const useFetchUser = (userId, enabled = true) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId && enabled,
  });
};
