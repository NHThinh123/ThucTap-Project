import axios from "../../../services/axios.customize";

const uploadVideoApi = async (file, { onProgress } = {}) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    console.log("Sending video upload request:", file.name);
    const response = await axios.post(`/api/upload/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          console.log("Video upload progress event:", {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent,
          });
          onProgress?.(percent);
        } else {
          console.warn("progressEvent.total is undefined");
        }
      },
    });

    const data = response.data || response;
    const videoUrl = data.data?.video_url || data.video_url;
    const thumbnail = data.data?.thumbnail || data.thumbnail;
    const duration = data.data?.duration || data.duration || 0;

    console.log("Video upload response:", data);

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

const uploadThumbnailApi = async (file, { onProgress } = {}) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    console.log("Sending thumbnail upload request:", file.name);
    const response = await axios.post(`/api/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          console.log("Thumbnail upload progress event:", {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent,
          });
          onProgress?.(percent);
        } else {
          console.warn("progressEvent.total is undefined");
        }
      },
    });

    console.log("Thumbnail upload response:", response.data);

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
      thumbnail: videoData.thumbnail,
    };

    const response = await axios.post("/api/video/create", payload);

    console.log("Create video response:", response.data);

    return response.data || response;
  } catch (error) {
    console.error("Create video error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.message ||
        error.message ||
        "Lỗi khi tạo video"
    );
  }
};

export { uploadVideoApi, createVideoApi, uploadThumbnailApi };
