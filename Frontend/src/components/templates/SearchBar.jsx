import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete } from "antd";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import "../../styles/searchbar.css";
import useSearch from "../../features/search/hooks/useSeach";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái dropdown
  const navigate = useNavigate();
  const { suggestions, isSuggestionsLoading } = useSearch(searchValue || []);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
      setIsDropdownOpen(!!value); // Mở dropdown khi có giá trị nhập
    }, 0),
    []
  );

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setIsDropdownOpen(false); // Đóng dropdown sau khi tìm kiếm
    }
  };

  // Hàm xử lý khi chọn gợi ý
  const onSelect = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  // Xử lý khi xóa nội dung
  const onClear = () => {
    setSearchValue("");
    setIsDropdownOpen(false); // Đóng dropdown khi xóa
  };

  return (
    <div className="search-bar">
      <AutoComplete
        options={
          suggestions.suggestions?.map((suggestion) => ({
            value: suggestion,
          })) || []
        }
        style={{ width: "100%", maxWidth: "600px" }}
        onSearch={handleSearch}
        onSelect={onSelect}
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value);
          setIsDropdownOpen(!!value); // Giữ dropdown mở khi nhập
        }}
        open={isDropdownOpen} // Điều khiển trạng thái dropdown
        onBlur={() => setIsDropdownOpen(false)} // Đóng dropdown khi mất focus
      >
        <Input
          size="large"
          placeholder="Tìm kiếm..."
          className="search-input"
          onPressEnter={() => onSearch(searchValue)}
          loading={isSuggestionsLoading}
          allowClear // Thêm nút xóa nhanh
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
          onClear={onClear} // Xử lý khi nhấn nút xóa
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
