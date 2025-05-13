export const formatTime = (dateString) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const diffInSeconds = Math.floor((currentDate - postDate) / 1000);

  // Dưới 60 giây
  if (diffInSeconds < 60) {
    return "vừa xong";
  }

  // Dưới 60 phút
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  // Dưới 24 giờ
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  // Dưới 7 ngày
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // Dưới 12 tháng
  const diffInMonths = Math.floor(diffInDays / 30); // Ước lượng 1 tháng = 30 ngày
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  // Trên 12 tháng
  const diffInYears = Math.floor(diffInMonths / 12);
  if (diffInYears >= 1) {
    return `${diffInYears} năm trước`;
  }

  // Trên 7 ngày thì hiển thị định dạng ngày/tháng/năm
  return postDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
