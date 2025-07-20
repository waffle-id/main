import { useEffect, useState } from "react";
import { SearchBar } from "./search-bar";

export function SearchBarWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <SearchBar />;
}
