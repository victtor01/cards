import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type DebouceType<T> = { value: T; loading: boolean };

function useDebounce<T>(value: T, delay: number): DebouceType<T> {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [loadingDebounce, setLoadingDebounce] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setLoadingDebounce(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setLoadingDebounce(true);
    };
  }, [value, delay]);

  return { value: debouncedValue, loading: loadingDebounce };
}

type SearchCard = ICard & { contentLength: number };

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { value: debouncedSearchTerm, loading } = useDebounce(searchTerm, 500);
  const enabled = debouncedSearchTerm.trim().length > 0;

  const searchAction = useQuery<SearchCard[]>({
    enabled,
    queryKey: ["cards", "search", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm.trim() === "") return null;

      const response = await api.post("/cards/search", {
        title: debouncedSearchTerm,
      });

      return response.data;
    },
  });

  return {
    setSearchTerm,
    searchAction,
    searchTerm,
    loading,
  };
}
