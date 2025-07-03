import { Modal } from "antd";
const LoginRequiredModal = ({ isModalOpen, handleCancel }) => {
  return (
    <>
      <Modal
        title="Yêu cầu đăng nhập"
        open={isModalOpen}
        onCancel={handleCancel}
        cancelText="Đóng"
        okText="Đăng nhập"
        onOk={() => {
          window.location.href = "/login";
        }}
      >
        <p style={{ margin: "32px 0px" }}>
          Vui lòng đăng nhập để thực hiện hành động này!
        </p>
      </Modal>
    </>
  );
};

export default LoginRequiredModal;
