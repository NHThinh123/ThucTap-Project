import axios from "../../../services/axios.customize";

export const editVideoApi = async (videoId, data) => {
  if (!videoId || !data) {
    throw new Error("Video ID hoặc dữ liệu không hợp lệ");
  }
  try {
    const payload = {
      title: data.title || "",
      description: data.description || "",
      thumbnail: data.thumbnail || null,
    };

    console.log("Sending edit video request:", { videoId, payload });
    const response = await axios.put(
      `/api/video/admin/updateVideo/${videoId}`,
      payload
    );

    console.log("Edit video response:", response.data);

    // ✅ Trả về response.data hoặc response tùy thuộc vào cấu trúc
    return response.data || response;
  } catch (error) {
    console.error("Edit video error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi cập nhật video"
    );
  }
};

export const deleteVideoApi = async (videoId) => {
  if (!videoId) {
    throw new Error("Video ID  không hợp lệ");
  }
  try {
    console.log("Sending delete video request:", { videoId });
    const response = await axios.delete(
      `/api/video/admin/deleteVideo/${videoId}`
    );

    console.log("Delete video response:", response.data);
    return response.data || response;
  } catch (error) {
    console.error("Delete video error:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi xóa video"
    );
  }
};
