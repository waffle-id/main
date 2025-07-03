import { createContext, useContext, useState } from "react";
import type { User } from "~/services/auth.server";

// export type TwitterUser = {
//   twitterUser: {
//     name: string;
//     screen_name: string;
//   };
// };

export interface WaffleContextType {
  twitterUser: User | null;
  setTwitterUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const WaffleContext = createContext<WaffleContextType | null>(null);

export function WaffleProvider({ children }: { children: React.ReactNode }) {
  const [twitterUser, setTwitterUser] = useState<User | null>(null);

  return (
    <WaffleContext.Provider
      value={{
        // isOpen,
        // setIsOpen,
        twitterUser,
        setTwitterUser,
      }}
    >
      {children}
    </WaffleContext.Provider>
  );
}

export function useWaffleProvider() {
  const context = useContext(WaffleContext);
  if (!context) {
    throw new Error("useWaffleProvider must be used within a WaffleProvider");
  }
  return context;
}
