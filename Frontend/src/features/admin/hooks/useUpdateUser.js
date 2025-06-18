import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { updateUser } from "../services/userServiceAPI";

export const useUpdateUser = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("Cập nhật người dùng thành công");
    },
    onError: () => {
      message.error("Cập nhật người dùng thất bại");
    },
  });
};
