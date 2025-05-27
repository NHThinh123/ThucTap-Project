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

  // Dưới 4 tuần (28 ngày)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  // Dưới 12 tháng
  const diffInMonths = Math.floor(
    currentDate.getFullYear() * 12 +
      currentDate.getMonth() -
      (postDate.getFullYear() * 12 + postDate.getMonth())
  );
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  // Trên hoặc bằng 12 tháng
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
};
