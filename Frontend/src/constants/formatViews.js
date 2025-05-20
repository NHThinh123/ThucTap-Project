export const formatViews = (views) => {
  if (views >= 10000000000) {
    // Từ 10 tỷ trở lên, hiển thị số nguyên + "T"
    const billions = Math.floor(views / 1000000000);
    return `${billions} T`;
  } else if (views >= 1000000000) {
    // Từ 1 tỷ đến dưới 10 tỷ, hiển thị 1 chữ số thập phân + "T"
    const billions = views / 1000000000;
    if (Math.round(billions * 10) % 10 === 0) {
      return `${Math.floor(billions)} T`;
    }
    return `${billions.toFixed(1).replace(".", ",")} T`;
  } else if (views >= 100000000) {
    // Từ 100 triệu đến dưới 1 tỷ, hiển thị số nguyên + "Tr"
    const millions = Math.floor(views / 1000000);
    return `${millions} Tr`;
  } else if (views >= 10000000) {
    // Từ 10 triệu đến dưới 100 triệu, hiển thị số nguyên + "Tr"
    const millions = Math.floor(views / 1000000);
    return `${millions} Tr`;
  } else if (views >= 1000000) {
    // Từ 1 triệu đến dưới 10 triệu, hiển thị số nguyên + "Tr"
    const millions = Math.floor(views / 1000000);
    return `${millions} Tr`;
  } else if (views >= 100000) {
    // Từ 100 nghìn đến dưới 1 triệu, hiển thị 1 chữ số thập phân + "N"
    const thousands = views / 1000;
    if (Math.round(thousands * 10) % 10 === 0) {
      return `${Math.floor(thousands)} N`;
    }
    return `${thousands.toFixed(1).replace(".", ",")} N`;
  } else if (views >= 10000) {
    // Từ 10 nghìn đến dưới 100 nghìn, hiển thị số nguyên + "N"
    const thousands = Math.floor(views / 1000);
    return `${thousands} N`;
  } else if (views >= 1000) {
    // Từ 1 nghìn đến dưới 10 nghìn, hiển thị 1 chữ số thập phân + "N"
    const thousands = views / 1000;
    if (Math.round(thousands * 10) % 10 === 0) {
      return `${Math.floor(thousands)} N`;
    }
    return `${thousands.toFixed(1).replace(".", ",")} N`;
  }
  // Dưới 1 nghìn, trả về nguyên số
  return views.toString();
};
