// utils/formatDateLabel.js
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isoWeek);
dayjs.locale("vi");

export const formatDateLabel = (dateString) => {
  const date = dayjs(dateString);
  const today = dayjs();

  if (date.isToday()) return "Hôm nay";

  // Kiểm tra nếu ngày trong cùng tuần với hôm nay
  const startOfWeek = today.startOf("week"); // mặc định: Chủ nhật là đầu tuần
  const endOfWeek = today.endOf("week");

  if (
    date.isSameOrAfter(startOfWeek) &&
    date.isSameOrAfter(today.startOf("week")) &&
    date.isBefore(endOfWeek)
  ) {
    return date.format("dddd"); // Thứ hai, Thứ ba, ...
  }

  // Ngày cũ hơn: hiển thị "17 thg 6"
  return date.format("D [thg] M");
};
