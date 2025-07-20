import { Search } from "lucide-react";
import { useSearch } from "~/contexts/search-context";

export function SearchButton() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 group cursor-pointer"
      aria-label="Search users"
    >
      <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
    </button>
  );
}
