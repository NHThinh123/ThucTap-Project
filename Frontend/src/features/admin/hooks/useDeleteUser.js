import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { deleteUser } from "../services/userServiceAPI";

export const useDeleteUser = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("Xóa người dùng thành công");
    },
    onError: () => {
      message.error("Xóa người dùng thất bại");
    },
  });
};
