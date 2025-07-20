import { useEffect, useRef, useState } from "react";
import { Search, X, User } from "lucide-react";
import { useSearch } from "~/contexts/search-context";
import { cn } from "~/utils/cn";

export function SearchBar() {
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery } = useSearch();
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isEthereumAddress = (input: string): boolean => {
    return input.startsWith("0x") && input.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(input);
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const handleSelectUser = (usernameOrAddress: string) => {
    closeSearch();

    if (!isClient) return;

    const isAddress = isEthereumAddress(usernameOrAddress);
    const profilePath = isAddress
      ? `/profile/w/${usernameOrAddress}`
      : `/profile/x/${usernameOrAddress}`;

    window.location.href = profilePath;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (!query) return;

    handleSelectUser(query);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200/50">
      <div className="flex items-center w-full h-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by username or wallet address (0x...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none placeholder-gray-500 cursor-text transition-all duration-200"
              />
              {searchQuery.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {isEthereumAddress(searchQuery) ? "Address" : "Username"}
                </div>
              )}
            </div>
            {searchQuery.trim() && (
              <button
                type="submit"
                className="ml-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-200 font-medium text-sm cursor-pointer"
              >
                Go
              </button>
            )}
          </form>

          <button
            onClick={closeSearch}
            className="ml-4 p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-orange-200/50 shadow-lg max-h-96 overflow-y-auto">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => handleSelectUser(searchQuery.trim())}
                className="w-full p-4 hover:bg-orange-50 rounded-xl transition-colors duration-200 text-left group cursor-pointer border border-orange-200 hover:border-orange-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        isEthereumAddress(searchQuery.trim()) ? "bg-blue-100" : "bg-orange-100"
                      )}
                    >
                      <User
                        className={cn(
                          "w-6 h-6",
                          isEthereumAddress(searchQuery.trim())
                            ? "text-blue-600"
                            : "text-orange-600"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {isEthereumAddress(searchQuery.trim())
                          ? "Wallet Address"
                          : `@${searchQuery.trim()}`}
                      </h3>
                      <span
                        className={cn(
                          "text-sm font-medium px-2 py-1 rounded-full",
                          isEthereumAddress(searchQuery.trim())
                            ? "text-blue-600 bg-blue-100"
                            : "text-orange-600 bg-orange-100"
                        )}
                      >
                        {isEthereumAddress(searchQuery.trim()) ? "Address" : "Username"}
                      </span>
                    </div>

                    {isEthereumAddress(searchQuery.trim()) ? (
                      <p className="text-gray-600 text-sm mt-1 font-mono break-all">
                        {searchQuery.trim()}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm mt-1">
                        Search for user "{searchQuery.trim()}"
                      </p>
                    )}

                    <p className="text-gray-500 text-xs mt-1">
                      Press Enter or click to view profile
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
