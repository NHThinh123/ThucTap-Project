export const formatLikes = (likes) => {
  if (likes >= 10000000000) {
    // Từ 10 tỷ trở lên, hiển thị số nguyên + "T"
    const billions = Math.floor(likes / 1000000000);
    return `${billions} T`;
  } else if (likes >= 1000000000) {
    // Từ 1 tỷ đến dưới 10 tỷ, hiển thị số nguyên + "T"
    const billions = Math.floor(likes / 1000000000);
    return `${billions} T`;
  } else if (likes >= 1000000) {
    // Từ 1 triệu đến dưới 1 tỷ, hiển thị số nguyên + "Tr"
    const millions = Math.floor(likes / 1000000);
    return `${millions} Tr`;
  } else if (likes >= 1000) {
    // Từ 1 nghìn đến dưới 1 triệu, hiển thị số nguyên + "N"
    const thousands = Math.floor(likes / 1000);
    return `${thousands} N`;
  }
  // Dưới 1 nghìn, trả về số nguyên
  return likes.toString();
};
