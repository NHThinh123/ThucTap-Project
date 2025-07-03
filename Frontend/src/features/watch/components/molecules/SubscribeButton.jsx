import { Button, Modal, message } from "antd";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import useSubscribe from "../../../channel/hooks/useSubscribe";
import useUnsubscribe from "../../../channel/hooks/useUnsubscribe";
import LoginRequiredModal from "../../../../components/templates/LoginRequiredModal";

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
  const [buttonAntdSize, setButtonAntSize] = useState(18);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showLoginModal = () => setIsModalOpen(true);
  const handleCancelModal = () => setIsModalOpen(false);

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
        setButtonAntSize(12);
      } else if (width < breakpoints.md) {
        // sm
        setButtonAntSize(13);
      } else if (width < breakpoints.lg) {
        // md
        setButtonAntSize(14);
      } else if (width < breakpoints.xl) {
        // lg
        setButtonAntSize(15);
      } else if (width < breakpoints.xxl) {
        // xl
        setButtonAntSize(16);
      } else {
        // xxl
        setButtonAntSize(16);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleClick = () => {
    if (!userId) {
      showLoginModal();
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
          fontSize: buttonAntdSize,
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
      <LoginRequiredModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancelModal}
      />
    </>
  );
};

export default SubscribeButton;
