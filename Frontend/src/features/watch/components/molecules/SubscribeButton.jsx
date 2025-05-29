import { Button, Modal, message } from "antd";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import useSubscribe from "../../../channel/hooks/useSubscribe";
import useUnsubscribe from "../../../channel/hooks/useUnsubscribe";

const SubscribeButton = ({
  channelId,
  userId,
  isSubscribed: initialIsSubscribed,
  setSubscriptionCount,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate: subscribe, isLoading: isSubscribing } = useSubscribe();
  const { mutate: unsubscribe, isLoading: isUnsubscribing } = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);

  const handleClick = () => {
    if (!userId) {
      message.error("Vui lòng đăng nhập để đăng ký!");
      return;
    }

    if (!isSubscribed) {
      // Gọi API đăng ký
      subscribe(
        { userId, channelId },
        {
          onSuccess: (response) => {
            setIsSubscribed(true);
            setSubscriptionCount((prev) => prev + 1); // Tăng số lượng người đăng ký
            message.success(response.data.message || "Đã đăng ký thành công!");
          },
          onError: (error) => {
            message.error(
              error.response?.data?.message || "Không thể đăng ký!"
            );
          },
        }
      );
    } else {
      // Hiển thị modal xác nhận hủy đăng ký
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUnsubscribe = () => {
    // Gọi API hủy đăng ký
    unsubscribe(
      { userId, channelId },
      {
        onSuccess: (response) => {
          setIsSubscribed(false);
          setSubscriptionCount((prev) => prev - 1); // Giảm số lượng người đăng ký
          setIsModalVisible(false);
          message.success(
            response.data.message || "Đã hủy đăng ký thành công!"
          );
        },
        onError: (error) => {
          message.error(
            error.response?.data?.message || "Không thể hủy đăng ký!"
          );
        },
      }
    );
  };

  return (
    <>
      <Button
        style={{
          color: "#fff",
          background: isSubscribed ? "#000" : "#FF0000",
          border: "none",
          marginLeft: 20,
          fontSize: 16,
          fontWeight: 500,
          padding: isSubscribed ? "0 20px 0 20px" : "0 20px",
          height: 40,
          boxShadow: "none",
          cursor: "pointer",
        }}
        onClick={handleClick}
        loading={isSubscribing || isUnsubscribing}
        disabled={isSubscribing || isUnsubscribing}
      >
        {isSubscribed ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            Đã đăng ký{" "}
            <ChevronDown strokeWidth={1.25} style={{ marginLeft: 5 }} />
          </div>
        ) : (
          <>Đăng ký</>
        )}
      </Button>

      <Modal
        title=""
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUnsubscribe}
        okText="Hủy đăng ký"
        cancelText="Hủy"
        style={{ top: "40vh" }}
        width={350}
        confirmLoading={isUnsubscribing}
      >
        <p>Hủy đăng ký kênh này?</p>
      </Modal>
    </>
  );
};

export default SubscribeButton;
