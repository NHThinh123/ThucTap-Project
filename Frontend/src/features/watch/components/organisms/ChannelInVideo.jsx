import { Avatar, Space } from "antd";
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
  const [dimensions, setDimensions] = useState({
    avatarSize: 45,
    nickNameFontSize: 15,
    subscriberFontSize: 13,
    buttonSize: "large",
  });

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

  // Cập nhật kích thước dựa trên kích thước màn hình
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const breakpoints = {
        xs: 576,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1600,
      };

      if (width < breakpoints.sm) {
        // xs
        setDimensions({
          avatarSize: 30,
          nickNameFontSize: 12,
          subscriberFontSize: 11,
          buttonSize: "small",
        });
      } else if (width < breakpoints.md) {
        // sm
        setDimensions({
          avatarSize: 32,
          nickNameFontSize: 13,
          subscriberFontSize: 11,
          buttonSize: "middle",
        });
      } else if (width < breakpoints.lg) {
        // md
        setDimensions({
          avatarSize: 35,
          nickNameFontSize: 13,
          subscriberFontSize: 12,
          buttonSize: "middle",
        });
      } else if (width < breakpoints.xl) {
        // lg
        setDimensions({
          avatarSize: 38,
          nickNameFontSize: 14,
          subscriberFontSize: 12,
          buttonSize: "large",
        });
      } else if (width < breakpoints.xxl) {
        // xl
        setDimensions({
          avatarSize: 42,
          nickNameFontSize: 14,
          subscriberFontSize: 13,
          buttonSize: "large",
        });
      } else {
        // xxl
        setDimensions({
          avatarSize: 45,
          nickNameFontSize: 15,
          subscriberFontSize: 13,
          buttonSize: "large",
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Dữ liệu channel từ API
  const channelInfo = channelData?.data || {};
  const isSubscribed = subscriptionData?.data?.isSubscribed || false;

  // Xử lý khi dữ liệu đang tải
  if (isLoadingChannel || isLoadingSubscription) {
    return <div>Đang tải...</div>;
  }

  return (
    <Space>
      <Link
        to={`/channel/${channelId}`}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/channel/${channelId}`;
        }}
      >
        <Avatar
          src={
            channelInfo.avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
          }
          size={dimensions.avatarSize}
        />
      </Link>
      <div style={{ marginLeft: 5, paddingRight: 20 }}>
        <Link
          to={`/channel/${channelId}`}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/channel/${channelId}`;
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: dimensions.nickNameFontSize,
              color: "#000",
            }}
          >
            {channelInfo.nickName || "Channel Name"}
          </p>
        </Link>
        <p
          style={{
            fontWeight: 400,
            fontSize: dimensions.subscriberFontSize,
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
          size={dimensions.buttonSize}
          setSubscriptionCount={setSubscriptionCount}
        />
      )}
    </Space>
  );
};

export default ChannelInVideo;
