import axios from "../../../services/axios.customize";

export const editVideoApi = async (videoId, data) => {
  try {
    const formData = new FormData();
    if (data.thumbnail) {
      formData.append("image", data.thumbnail);
    }
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("user_id", data.user_id);

    console.log("Sending edit video request:", { videoId, data });
    const response = await axios.put(`/api/video/${videoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Edit video response:", response.data);
    return response.data || response;
  } catch (error) {
    console.error("Edit video error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi cập nhật video"
    );
  }
};

export const deleteVideoApi = async (videoId, userId) => {
  try {
    console.log("Sending delete video request:", { videoId, userId });
    const response = await axios.delete(`/api/video/${videoId}`, {
      data: { user_id: userId },
    });

    console.log("Delete video response:", response.data);
    return response.data || response;
  } catch (error) {
    console.error("Delete video error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi xóa video"
    );
  }
};
