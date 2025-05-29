import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unsubscribeApi } from "../services/subscriptionApi";

const useUnsubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unsubscribe"],
    mutationFn: ({ userId, channelId }) => {
      return unsubscribeApi(userId, channelId);
    },
    onSuccess: (response, { userId, channelId }) => {
      // Làm mới cache cho số lượng người đăng ký và trạng thái đăng ký
      queryClient.invalidateQueries(["subscriptionCount", channelId]);
      queryClient.invalidateQueries(["checkSubscription", userId, channelId]);
    },
  });
};

export default useUnsubscribe;
