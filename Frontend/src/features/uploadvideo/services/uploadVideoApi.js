import axios from "../../../services/axios.customize";

const uploadVideoApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    const response = await axios.post(`/api/upload/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = response.data || response;
    const videoUrl = data.data?.video_url || data.video_url;
    const thumbnail = data.data?.thumbnail || data.thumbnail; // Lấy thumbnail mặc định
    const duration = data.data?.duration || data.duration || 0;

    if (!videoUrl) {
      throw new Error("Không tìm thấy URL video trong phản hồi");
    }
    return { videoUrl, thumbnail, duration };
  } catch (error) {
    console.error("Upload video error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi tải video"
    );
  }
};

const uploadThumbnailApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`/api/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = response.data || response;
    const thumbnail = data.data?.img_url || data.img_url;

    if (!thumbnail) {
      throw new Error("Không tìm thấy URL thumbnail trong phản hồi");
    }
    return thumbnail;
  } catch (error) {
    console.error("Upload thumbnail error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi tải thumbnail"
    );
  }
};

const createVideoApi = async (videoData) => {
  try {
    const payload = {
      user_id: videoData.user_id,
      video_url: videoData.video_url,
      title: videoData.title,
      description: videoData.description,
      duration: videoData.duration,
      thumbnail: videoData.thumbnail, // Sử dụng thumbnail mặc định hoặc tùy chỉnh
    };

    const response = await axios.post("/api/video/create", payload);

    return response.data || response;
  } catch (error) {
    console.error("Lỗi từ backend:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.message ||
        error.message ||
        "Lỗi khi tạo video"
    );
  }
};

export { uploadVideoApi, createVideoApi, uploadThumbnailApi };
