export const formatViews = (views) => {
  if (views >= 1000000000) {
    // Từ 1 tỷ trở lên, hiển thị 1 chữ số thập phân + "T"
    const billions = views / 1000000000;
    if (billions % 1 === 0) {
      return `${billions} T`;
    }
    return `${billions.toFixed(1).replace(".", ",")} T`;
  } else if (views >= 100000000) {
    // Từ 100 triệu đến dưới 1 tỷ, hiển thị số nguyên + "Tr"
    const millions = Math.floor(views / 1000000);
    return `${millions} Tr`;
  } else if (views >= 1000000) {
    // Từ 1 triệu đến dưới 100 triệu, hiển thị 1 chữ số thập phân + "Tr"
    const millions = views / 1000000;
    if (millions % 1 === 0) {
      return `${millions} Tr`;
    }
    return `${millions.toFixed(1).replace(".", ",")} Tr`;
  } else if (views >= 1000) {
    // Từ 1 nghìn đến dưới 1 triệu, hiển thị 1 chữ số thập phân + "N"
    const thousands = views / 1000;
    if (thousands % 1 === 0) {
      return `${thousands} N`;
    }
    return `${thousands.toFixed(1).replace(".", ",")} N`;
  }
  // Dưới 1 nghìn, trả về nguyên số
  return views.toString();
};
