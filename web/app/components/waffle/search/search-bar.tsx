import { useEffect, useRef, useState, useCallback, useId } from "react";
import { Search, X } from "lucide-react";

const isEthereumAddress = (input: string): boolean => {
  return input.startsWith("0x") && input.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(input);
};

const sanitizeInput = (input: string): string => {

  let sanitized = input.toLowerCase();


  sanitized = sanitized.replace(/^https?:\/\//, '');
  sanitized = sanitized.replace(/^ftp:\/\//, '');
  sanitized = sanitized.replace(/^file:\/\//, '');
  sanitized = sanitized.replace(/www\./g, '');


  sanitized = sanitized.replace(/[^a-z0-9._\-x]/g, '');


  sanitized = sanitized.replace(/[.\-_]{2,}/g, '');


  sanitized = sanitized.replace(/^[.\-_]+|[.\-_]+$/g, '');

  return sanitized;
};

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectUser = useCallback((usernameOrAddress: string) => {
    onClose();

    if (!isClient) return;

    const isAddress = isEthereumAddress(usernameOrAddress);
    const profilePath = isAddress
      ? `/profile/w/${usernameOrAddress}`
      : `/profile/x/${usernameOrAddress}`;

    window.location.href = profilePath;
  }, [onClose, isClient]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const query = sanitizeInput(searchQuery.trim());

    if (!query) return;

    handleSelectUser(query);
  }, [searchQuery, handleSelectUser]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    setSearchQuery(sanitized);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md border-b border-yellow-200/50">
      <div className="flex items-center w-full h-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <div className="relative flex-1">
              <label htmlFor={searchInputId} className="sr-only">
                Search by username or wallet address
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id={searchInputId}
                ref={inputRef}
                type="text"
                placeholder="Search by username or wallet address"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-10 pr-20 py-3 text-lg bg-white border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none placeholder-gray-500 cursor-text transition-all duration-200"
                autoComplete="off"
                spellCheck="false"
              />
              {searchQuery.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {isEthereumAddress(searchQuery.trim()) ? "Address" : "Username"}
                </div>
              )}
            </div>
            {searchQuery.trim() && (
              <button
                type="submit"
                className="ml-3 px-6 py-3 hover:bg-yellow-500 text-white rounded-xl transition-colors duration-200 font-medium text-sm cursor-pointer"
                style={{ backgroundColor: "#fdba0f" }}
              >
                Go
              </button>
            )}
          </form>

          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 group cursor-pointer"
        aria-label="Search users"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}


export function SearchBarWrapper() {
  return null;
}
