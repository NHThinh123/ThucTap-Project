import { Avatar, Button, Space } from "antd";
import { Link } from "react-router-dom";
import SubscribeButton from "../molecules/SubscribeButton";
import { AuthContext } from "../../../../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import useChannelInfo from "../../../channel/hooks/useChannelInfo";
import useCheckSubscription from "../../../channel/hooks/useCheckSubscription";
import useSubscriptionCount from "../../../channel/hooks/useSubscriptionCount";
import { formatLikes } from "../../../../constants/formatLikes";

const ChannelInVideo = ({ channelId }) => {
  const { auth } = useContext(AuthContext);
  const userId = auth.isAuthenticated ? auth.user.id : null;
  const [subscriptionCount, setSubscriptionCount] = useState(0);

  // Lấy thông tin channel
  const { data: channelData, isLoading: isLoadingChannel } =
    useChannelInfo(channelId);

  // Lấy trạng thái đăng ký
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useCheckSubscription(userId, channelId);

  // Lấy số lượng người đăng ký
  const { data: subscriptionCountData } = useSubscriptionCount(channelId);

  // Cập nhật subscriptionCount khi dữ liệu từ API thay đổi
  useEffect(() => {
    if (subscriptionCountData?.data?.subscriptionCount !== undefined) {
      setSubscriptionCount(subscriptionCountData.data.subscriptionCount);
    }
  }, [subscriptionCountData]);

  // Dữ liệu channel từ API
  const channelInfo = channelData?.data || {};
  const isSubscribed = subscriptionData?.data?.isSubscribed || false;

  // Xử lý khi dữ liệu đang tải
  if (isLoadingChannel || isLoadingSubscription) {
    return <div>Đang tải...</div>;
  }
  return (
    <Space>
      <Link to={`/channel/${channelId}`}>
        <Avatar
          src={
            channelInfo.avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
          }
          size={45}
        />
      </Link>
      <div style={{ marginLeft: 5, fontSize: 14, paddingRight: 20 }}>
        <Link to={`/channel/${channelId}`}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: "#000",
            }}
          >
            {channelInfo.nickName || "Channel Name"}
          </p>
        </Link>
        <p
          style={{
            fontWeight: 400,
            fontSize: 13,
            color: "#606060",
          }}
        >
          {subscriptionCount > 0
            ? `${formatLikes(subscriptionCount.toLocaleString())} người đăng ký`
            : "0 người đăng ký"}
        </p>
      </div>
      {channelId !== userId && (
        <SubscribeButton
          channelId={channelId}
          userId={userId}
          isSubscribed={isSubscribed}
          setSubscriptionCount={setSubscriptionCount}
        />
      )}
    </Space>
  );
};

export default ChannelInVideo;
