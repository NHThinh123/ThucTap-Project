import { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { Card, message } from "antd";
import AvatarUpload from "../features/auth/components/organisms/AvatarUpload";
import ProfileForm from "../features/auth/components/templates/ProfileForm";
import ProfileInfo from "../features/auth/components/organisms/ProfileInfo";
import { useUpdateProfile } from "../features/auth/hooks/useProfile";

const ProfilePage = () => {
    const { auth, setAuth } = useContext(AuthContext);
    console.log(auth);
    const { mutate: updateProfile } = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);

    if (!auth.isAuthenticated) {
        return <p>Vui lòng đăng nhập để xem hồ sơ.</p>;
    }

    const handleUpdate = (updatedData) => {
        updateProfile(
            { id: auth.user.id, data: updatedData },
            {
                onSuccess: (newUser) => {
                    setAuth({ isAuthenticated: true, user: newUser });
                    message.success("Cập nhật thông tin thành công!");
                    setIsEditing(false);
                },
            }
        );
    };

    return (
        <Card title={<span style={{ fontWeight: 'bold' }}>Hồ sơ cá nhân</span>} style={{ maxWidth: 600, margin: "auto", textAlign: "center" }}>
            <AvatarUpload avatar={auth.user.avatar} onUpdate={handleUpdate} />
            {isEditing ? (
                <ProfileForm user={auth.user} onSave={handleUpdate} onCancel={() => setIsEditing(false)} />
            ) : (
                <ProfileInfo user={auth.user} onEdit={() => setIsEditing(true)} />
            )}
        </Card>
    );
};

export default ProfilePage;
