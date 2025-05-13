import { useState, useContext } from "react";
import { Upload, Avatar, message, Spin } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useUpdateProfile } from "../../hooks/useProfile";
import { AuthContext } from "../../../../contexts/auth.context";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const AvatarUpload = ({ avatar }) => {
    const [imageUrl, setImageUrl] = useState(avatar);
    const [isUploading, setIsUploading] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const updateProfile = useUpdateProfile();

    const validateFile = (file) => {
        // Kiểm tra kích thước file
        if (file.size > MAX_FILE_SIZE) {
            message.error('File không được vượt quá 5MB');
            return false;
        }

        // Kiểm tra định dạng file
        if (!ALLOWED_TYPES.includes(file.type)) {
            message.error('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
            return false;
        }

        return true;
    };

    const handleUpload = async (file) => {
        if (!auth.user.id) {
            message.error("Bạn chưa đăng nhập!");
            return;
        }

        if (!validateFile(file)) {
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const result = await updateProfile.mutateAsync({
                id: auth.user.id,
                data: formData
            });

            if (!result.user.avatar) {
                throw new Error("INVALID_RESPONSE");
            }

            setImageUrl(result.user.avatar);
            message.success("Tải ảnh lên thành công!");

            // Cập nhật Context & localStorage
            const updatedUser = { ...auth.user, avatar: result.user.avatar };
            setAuth({ isAuthenticated: true, user: updatedUser });
            localStorage.setItem("authUser", JSON.stringify(updatedUser));

        } catch (error) {
            // Xử lý các loại lỗi cụ thể
            let errorMessage = "Đã có lỗi xảy ra khi tải ảnh lên.";

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = "File không hợp lệ. Vui lòng kiểm tra lại.";
                        break;
                    case 401:
                        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
                        break;
                    case 413:
                        errorMessage = "Kích thước file quá lớn.";
                        break;
                    case 500:
                        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
                        break;
                }
            } else if (error.message === "INVALID_RESPONSE") {
                errorMessage = "Dữ liệu trả về không hợp lệ. Vui lòng thử lại.";
            } else if (error.message === "Network Error") {
                errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.";
            }

            console.error("Lỗi tải ảnh:", error);
            message.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar src={imageUrl} size={100} />
                {isUploading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%'
                    }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                )}
            </div>
            <div style={{ marginTop: 8 }}>
                <Upload
                    showUploadList={false}
                    customRequest={({ file }) => handleUpload(file)}
                    disabled={isUploading}
                >
                    <p style={{
                        cursor: isUploading ? "not-allowed" : "pointer",
                        color: isUploading ? "#999" : "blue"
                    }}>
                        <UploadOutlined /> {isUploading ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
                    </p>
                </Upload>
            </div>
        </div>
    );
};

export default AvatarUpload;