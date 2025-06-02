import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete } from "antd";
import { useState } from "react";
import "../../styles/searchbar.css"; // File CSS tùy chỉnh

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);

  // Hàm giả lập lấy gợi ý tìm kiếm (có thể thay bằng API thật)
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      // Gợi ý tìm kiếm giả lập
      const mockSuggestions = [
        { value: `${value} video` },
        { value: `${value} tutorial` },
        { value: `${value} music` },
        { value: `${value} live` },
      ];
      setOptions(mockSuggestions);
    } else {
      setOptions([]);
    }
  };

  // Hàm xử lý khi nhấn nút tìm kiếm hoặc Enter
  const onSearch = (value) => {
    console.log("Search query:", value); // Thay bằng logic tìm kiếm thực tế
    // Ví dụ: Chuyển hướng đến trang kết quả tìm kiếm
    // window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  // Hàm xử lý khi chọn gợi ý
  const onSelect = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <AutoComplete
        options={options}
        style={{ width: "100%", maxWidth: "600px" }}
        onSearch={handleSearch}
        onSelect={onSelect}
        value={searchValue}
        onChange={setSearchValue}
      >
        <Input
          size="large"
          placeholder="Tìm kiếm..."
          className="search-input"
          onPressEnter={() => onSearch(searchValue)}
        />
      </AutoComplete>
      <Button
        type="primary"
        size="large"
        icon={<SearchOutlined />}
        onClick={() => onSearch(searchValue)}
        className="search-button"
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;
