import axios from "../../../services/axios.customize";

const uploadVideoApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    const response = await axios.post(`/api/upload/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const videoUrl = response.video_url;
    const duration = response.duration;
    if (!videoUrl) {
      throw new Error("Không tìm thấy URL video trong phản hồi");
    }
    return { videoUrl, duration };
  } catch (error) {
    throw new Error(error.response.message || "Lỗi khi tải video");
  }
};
const uploadThumbnailApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`/api/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const thumbnail = response.img_url;
    if (!thumbnail) {
      throw new Error("Không tìm thấy URL thumbnail trong phản hồi");
    }
    return thumbnail;
  } catch (error) {
    throw new Error(error.response.message || "Lỗi khi tải thumbnail");
  }
};
// uploadVideoApi.js
const createVideoApi = async (videoData) => {
  try {
    const payload = {
      user_id: videoData.user_id,
      video_url: videoData.video_url,
      title: videoData.title,
      description_video: videoData.description,
      duration: videoData.duration,
      thumbnail: videoData.thumbnail,
    };
    //console.log("Payload gửi đi:", payload); // Debug payload
    const response = await axios.post("/api/video/create", payload, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${videoData.accessToken || ""}`, // Thêm accessToken nếu cần
      //   },
    });
    console.log("Phản hồi từ backend:", response.data);
    return response;
  } catch (error) {
    console.error("Lỗi từ backend:", error.response); // Log lỗi chi tiết
    throw new Error(error.response?.message || "Lỗi khi tạo video");
  }
};

export { uploadVideoApi, createVideoApi, uploadThumbnailApi };
