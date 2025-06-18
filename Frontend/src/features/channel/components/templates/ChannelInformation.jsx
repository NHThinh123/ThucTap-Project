import { useContext, useEffect, useState } from "react";
import useChannelInfo from "../../hooks/useChannelInfo";
import { AuthContext } from "../../../../contexts/auth.context";
// import useCheckSubscription from "../../hooks/useCheckSubscription";
// import { formatLikes } from "../../../../constants/formatLikes";
import { Avatar, Button, Col, Row, Space, Typography } from "antd";
import SubscribeButton from "../../../watch/components/molecules/SubscribeButton";
import useCheckSubscription from "../../hooks/useCheckSubscription";
import useSubscriptionCount from "../../hooks/useSubscriptionCount";
import { formatLikes } from "../../../../constants/formatLikes";
import useVideoCountByUserId from "../../../video/hooks/useVideoCountByUserId";

const ChannelInformation = ({ channelId }) => {
  const { auth } = useContext(AuthContext);
  const userId = auth.isAuthenticated ? auth.user.id : null;
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const { data, isLoading } = useChannelInfo(channelId); // Gọi hook useChannelInfo
  const channelInfo = data?.data;

  //Lấy số lượng video
  const { data: countVideoData, isLoading: isLoadingCountVideo } =
    useVideoCountByUserId(channelId);

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
  const isSubscribed = subscriptionData?.data?.isSubscribed || false;
  if (isLoading || isLoadingSubscription || isLoadingCountVideo) {
    return <div>Đang tải...</div>;
  }
  return (
    <Row align={"middle"} gutter={16}>
      <Col>
        <div>
          <Avatar src={channelInfo?.avatar} alt="Avatar" size={100} />
        </div>
      </Col>
      <Col>
        <div>
          <Typography.Title level={1} style={{ margin: 0 }}>
            {channelInfo?.nickName}
          </Typography.Title>
          <Typography.Text>
            {subscriptionCount > 0
              ? `${formatLikes(
                  subscriptionCount.toLocaleString()
                )} người đăng ký`
              : "0 người đăng ký"}{" "}
            • {countVideoData?.total} video
          </Typography.Text>
          <br />
          <Space style={{ marginTop: "16px" }}>
            {channelId !== userId ? (
              <SubscribeButton
                channelId={channelId}
                userId={userId}
                isSubscribed={isSubscribed}
                setSubscriptionCount={setSubscriptionCount}
              />
            ) : (
              <>
                <Button href="/studio">Quản lý kênh</Button>
              </>
            )}
          </Space>
        </div>
      </Col>
    </Row>
  );
};

export default ChannelInformation;
