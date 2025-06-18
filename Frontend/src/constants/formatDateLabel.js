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

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDateLabel = (dateString) => {
  const date = dayjs(dateString);
  const today = dayjs();

  if (date.isToday()) return "Hôm nay";
  if (date.isYesterday()) return "Hôm qua";

  // Kiểm tra nếu ngày trong cùng tuần với hôm nay
  const startOfWeek = today.startOf("week");
  const endOfWeek = today.endOf("week");

  if (date.isSameOrAfter(startOfWeek) && date.isBefore(endOfWeek)) {
    return capitalizeFirstLetter(date.format("dddd")); // Viết hoa chữ cái đầu
  }

  // Ngày cũ hơn: hiển thị "17 thg 6"
  return date.format("D [thg] M");
};
