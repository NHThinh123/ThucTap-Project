import { Button, Modal } from "antd";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const SubscribeButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = () => {
    if (!isClicked) {
      setIsClicked(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUnsubscribe = () => {
    setIsClicked(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        style={{
          color: "#fff",
          background: isClicked ? "#000" : "#FF0000",
          border: "none",
          marginLeft: 20,
          fontSize: 16,
          fontWeight: 500,
          padding: isClicked ? "0 20px 0 20px" : "0 20px",
          height: 40,
          boxShadow: "none",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        {isClicked ? (
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
      >
        <p>Hủy đăng ký không?</p>
      </Modal>
    </>
  );
};

export default SubscribeButton;
