import { useQuery } from "@tanstack/react-query";
import {
  searchVideosApi,
  getSearchSuggestionsApi,
} from "../services/searchApi";

const useSearch = (searchQuery) => {
  // Hook cho tìm kiếm video
  const {
    data: searchResults = { videos: [], total: 0 },
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        return { videos: [], total: 0 };
      }
      const response = await searchVideosApi({ q: searchQuery });
      return response;
    },
    onError: (err) => {
      console.error("Error fetching search results:", err);
    },
    enabled: !!searchQuery, // Chỉ chạy query nếu có searchQuery
    keepPreviousData: true,
  });

  // Hook cho gợi ý tìm kiếm
  const {
    data: suggestions = [],
    isLoading: isSuggestionsLoading,
    isError: isSuggestionsError,
    error: suggestionsError,
  } = useQuery({
    queryKey: ["suggestions", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        return [];
      }
      const response = await getSearchSuggestionsApi({ q: searchQuery });
      return response;
    },
    onError: (err) => {
      console.error("Error fetching suggestions:", err);
    },
    enabled: !!searchQuery, // Chỉ chạy query nếu có searchQuery
    keepPreviousData: true,
  });

  return {
    searchResults,
    isSearchLoading,
    isSearchError,
    searchError,
    suggestions,
    isSuggestionsLoading,
    isSuggestionsError,
    suggestionsError,
  };
};

export default useSearch;
