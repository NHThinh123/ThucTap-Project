import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete } from "antd";
import { useState } from "react";
import { debounce } from "lodash";
import "../../styles/searchbar.css"; // File CSS tùy chỉnh
import useSearch from "../../features/search/hooks/useSeach";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { suggestions, isSuggestionsLoading } = useSearch(searchValue);

  const handleSearch = debounce((value) => {
    setSearchValue(value);
  }, 300);

  // Hàm xử lý khi nhấn nút tìm kiếm hoặc Enter
  //   const onSearch = (value) => {
  //     console.log("Search query:", value);
  //     window.location.href = `/search`;
  //   };

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  // Hàm xử lý khi chọn gợi ý
  const onSelect = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <AutoComplete
        options={suggestions.suggestions?.map((suggestion) => ({
          value: suggestion,
        }))}
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
          loading={isSuggestionsLoading}
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
