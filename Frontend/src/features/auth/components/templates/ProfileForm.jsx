import { Form, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const ProfileForm = ({ user, onCancel }) => {
    const [form] = Form.useForm();
    const { auth, setAuth } = useContext(AuthContext);
    const updateProfile = useUpdateProfile({
        onSuccess: (res) => {
            // Cập nhật thông tin người dùng trong context
            const updatedUser = { ...auth.user, ...res.user };
            setAuth({ isAuthenticated: true, user: updatedUser });
            localStorage.setItem("authUser", JSON.stringify(updatedUser));
            onCancel(); // Đóng form sau khi thành công
        },
        // Không cần onError ở đây vì hook đã xử lý thông báo
    });

    const disabledDate = (current) => {
        return current && current.isAfter(dayjs().endOf("day"));
    };

    const handleSubmit = (values) => {
        const updatedData = {
            name: values.name,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : undefined,
        };

        // Nếu có mật khẩu cũ và mới, thêm vào dữ liệu gửi lên
        if (values.oldPassword || values.newPassword) {
            if (!values.oldPassword || !values.newPassword) {
                message.error("Vui lòng nhập cả mật khẩu cũ và mới để đổi mật khẩu!");
                return;
            }
            updatedData.oldPassword = values.oldPassword;
            updatedData.newPassword = values.newPassword;
        }

        // Gọi API
        updateProfile.mutate({ id: user.id, data: updatedData });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ ...user, dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null }}
            onFinish={handleSubmit}
        >
            <Form.Item
                label="Họ và Tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    disabledDate={disabledDate}
                />
            </Form.Item>
            <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                rules={[
                    {
                        required: !!form.getFieldValue("newPassword"),
                        message: "Vui lòng nhập mật khẩu cũ khi đổi mật khẩu!",
                    },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                    {
                        required: !!form.getFieldValue("oldPassword"),
                        message: "Vui lòng nhập mật khẩu mới khi đổi mật khẩu!",
                    },
                    {
                        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
                        message:
                            "Mật khẩu phải dài ít nhất 8 ký tự, chứa 1 chữ cái in hoa, 1 số và 1 ký tự đặc biệt trong @$!%*?&#!",
                    },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={updateProfile.isLoading}>
                Lưu
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                Thoát
            </Button>
        </Form>
    );
};

export default ProfileForm;