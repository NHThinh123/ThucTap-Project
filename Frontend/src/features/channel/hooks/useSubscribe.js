import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeApi } from "../services/subscriptionApi";

const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["subscribe"],
    mutationFn: ({ userId, channelId }) => {
      return subscribeApi(userId, channelId);
    },
    onSuccess: (response, { userId, channelId }) => {
      // Làm mới cache cho số lượng người đăng ký và trạng thái đăng ký
      queryClient.invalidateQueries(["subscriptionCount", channelId]);
      queryClient.invalidateQueries(["checkSubscription", userId, channelId]);
    },
  });
};

export default useSubscribe;
