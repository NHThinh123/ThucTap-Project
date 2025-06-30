import { useQuery } from "@tanstack/react-query";
import { getVideoChannel } from "../services/channelApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

export const useChannelVideo = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth.isAuthenticated ? auth.user.id : null;

  return useQuery({
    queryKey: ["videos", userId || "guest"],
    queryFn: () => getVideoChannel({ userId }),
    staleTime: 1000 * 60, // cache 1 phút
  });
};
