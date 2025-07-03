import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete } from "antd";
import { useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";
import "../../styles/searchbar.css";
import useSearch from "../../features/search/hooks/useSeach";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = ({ setSearchFocused, isSearchFocused }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { suggestions, isSuggestionsLoading } = useSearch(searchValue || []);
  const isVideoWatchPage = pathname.startsWith("/watch/");

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
      setIsDropdownOpen(!!value);
    }, 300),
    []
  );

  const onSearch = (value) => {
    if (value.trim()) {
      isVideoWatchPage
        ? (window.location.href = `/search?q=${encodeURIComponent(value)}`)
        : navigate(`/search?q=${encodeURIComponent(value)}`);
      setIsDropdownOpen(false);
      if (windowWidth < 600) setSearchFocused(false);
    }
  };

  const onSelect = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  const onClear = () => {
    setSearchValue("");
    setIsDropdownOpen(false);
    if (windowWidth < 600) setSearchFocused(false);
  };

  return (
    <div
      className={`search-bar ${isSearchFocused ? "search-bar-focused" : ""}`}
    >
      <AutoComplete
        options={
          suggestions.suggestions?.map((suggestion) => ({
            value: suggestion,
          })) || []
        }
        style={{
          width: windowWidth < 500 ? "100%" : windowWidth < 768 ? 300 : 700,
          maxWidth: "100%",
        }}
        onSearch={handleSearch}
        onSelect={onSelect}
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value);
          setIsDropdownOpen(!!value);
        }}
        open={isDropdownOpen}
        onBlur={() => {
          setIsDropdownOpen(false);
          if (windowWidth < 500) setSearchFocused(false);
        }}
        onFocus={() => {
          if (windowWidth < 500) setSearchFocused(true);
        }}
      >
        <Input
          size={windowWidth < 700 ? "small" : "middle"}
          placeholder="Tìm kiếm..."
          className="search-input"
          onPressEnter={() => onSearch(searchValue)}
          loading={isSuggestionsLoading}
          allowClear
          style={{
            fontSize: windowWidth < 700 ? "12px" : "16px",
          }}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
          onClear={onClear}
          onFocus={() => {
            if (windowWidth < 500) setSearchFocused(true);
          }}
          onBlur={() => {
            if (windowWidth < 500) setSearchFocused(false);
          }}
        />
      </AutoComplete>
      <Button
        type="text"
        size={windowWidth < 700 ? "small" : "middle"}
        style={{
          fontSize: windowWidth < 700 ? "12px" : "16px",
        }}
        icon={<SearchOutlined className="search-icon" />}
        onClick={() => onSearch(searchValue)}
        className="search-button"
      >
        {windowWidth >= 768 && "Tìm kiếm"}
      </Button>
    </div>
  );
};

export default SearchBar;
