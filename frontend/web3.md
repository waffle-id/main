# Web3 Integration

Waffle's frontend provides seamless Web3 integration through multiple wallet providers and blockchain interactions. This document covers the implementation details and best practices for Web3 functionality.

## Wallet Integration

### Multi-Wallet Support

Waffle supports multiple wallet connection methods:

#### RainbowKit Integration

```typescript
// wagmi.ts
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Waffle',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});
```

#### Xellar Kit Integration

```typescript
// components/wallet/connect-wallet-xellar.tsx
import { ConnectButton, useConnectModal } from "@xellar/kit";
import { useAccount, useDisconnect } from "wagmi";

export function ConnectWalletXellar() {
  const { isConnected, address } = useAccount();
  const { open: openModalXellar } = useConnectModal();
  
  // Wallet connection logic
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <ButtonMagnet onClick={openModalXellar}>
          Connect Wallet
        </ButtonMagnet>
      )}
    </ConnectButton.Custom>
  );
}
```

### Wallet Authentication

#### Signature-Based Authentication

```typescript
// hooks/useWalletAuth.ts
export function useWalletAuth() {
  const { signMessageAsync } = useSignMessage();
  
  const loginWithWallet = async (address: string) => {
    try {
      // Get nonce from backend
      const nonceResponse = await fetch(`/auth/nonce/${address}`);
      const { nonce } = await nonceResponse.json();
      
      // Create message to sign
      const message = `Sign this message to authenticate with Waffle.\n\nNonce: ${nonce}`;
      
      // Sign message
      const signature = await signMessageAsync({ message });
      
      // Verify signature with backend
      const authResponse = await fetch('/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          message,
          signature
        })
      });
      
      return await authResponse.json();
    } catch (error) {
      console.error('Wallet authentication failed:', error);
      throw error;
    }
  };
  
  return { loginWithWallet };
}
```

#### State Management

```typescript
// components/waffle-provider.tsx
export function useWaffleProvider() {
  const [twitterUser, setTwitterUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const { address, isConnected } = useAccount();
  
  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      // Check authentication status
      checkAuthStatus(address);
    } else {
      // Clear user data on disconnect
      setTwitterUser(null);
      setAuthStatus(null);
    }
  }, [isConnected, address]);
  
  return {
    twitterUser,
    setTwitterUser,
    authStatus,
    setAuthStatus
  };
}
```

## Address Change Handling

### Automatic State Reset

```typescript
// Wallet address change detection
useEffect(() => {
  if (isConnected && address && address !== lastCheckedAddress) {
    // Clear previous user data when switching addresses
    if (lastCheckedAddress && address !== lastCheckedAddress) {
      console.log("🔄 Address changed, clearing previous user data");
      setTwitterUser(null);
      setAuthStatus(null);
      setIsAuthenticated(false);
      localStorage.removeItem("waffle_auth_token");
    }
    
    // Set new address
    localStorage.setItem("waffle_wallet_address", address);
    setLastCheckedAddress(address);
    
    // Check auth status for new address
    checkAuthStatus(address);
  }
}, [isConnected, address, lastCheckedAddress]);
```

### Profile Route Handling

```typescript
// Profile page wallet address support
export async function loader({ params }: { params: { variant: string; slug: string } }) {
  const { variant, slug } = params;
  
  // Handle wallet address profiles (variant = "w")
  if (variant === "w" && slug.startsWith("0x")) {
    const walletUserData: UserProfileData = {
      address: slug,
      username: `${slug.slice(0, 6)}...${slug.slice(-4)}`,
      fullName: `Wallet ${slug.slice(0, 6)}...${slug.slice(-4)}`,
      bio: "Wallet address profile - connect to see more details",
      avatarUrl: `https://api.dicebear.com/9.x/identicon/svg?seed=${slug}`,
      reputationScore: 1000,
      hasInvitationAuthority: false,
    };
    
    return { userData: walletUserData, needsScraping: false };
  }
  
  // Handle Twitter profiles (variant = "x")
  // ... existing logic
}
```

## Smart Contract Integration

### Contract Configuration

```typescript
// constants/contracts.ts
export const WAFFLE_CONTRACT = {
  address: '0x...' as `0x${string}`,
  abi: WaffleABI,
} as const;

export const BADGE_CONTRACT = {
  address: '0x...' as `0x${string}`,
  abi: BadgeABI,
} as const;
```

### Reading Contract Data

```typescript
// hooks/useContractData.ts
import { useContractRead } from 'wagmi';

export function useUserReputation(address: string) {
  const { data: reputation, isLoading } = useContractRead({
    ...WAFFLE_CONTRACT,
    functionName: 'getUserReputation',
    args: [address],
    enabled: !!address,
  });
  
  return { reputation, isLoading };
}

export function useUserBadges(address: string) {
  const { data: badges } = useContractRead({
    ...BADGE_CONTRACT,
    functionName: 'getUserBadges',
    args: [address],
  });
  
  return { badges };
}
```

### Writing to Contracts

```typescript
// hooks/useContractWrite.ts
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export function useSubmitReview() {
  const { config } = usePrepareContractWrite({
    ...WAFFLE_CONTRACT,
    functionName: 'submitReview',
  });
  
  const { write: submitReview, isLoading } = useContractWrite(config);
  
  return { submitReview, isLoading };
}
```

## Network Management

### Network Configuration

```typescript
// constants/wagmi.ts
export const FIXED_CHAIN = 137; // Polygon Mainnet

export const supportedChains = [
  {
    id: 1,
    name: 'Ethereum',
    network: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://eth-mainnet.g.alchemy.com/v2/...'] } },
  },
  {
    id: 137,
    name: 'Polygon',
    network: 'matic',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: { default: { http: ['https://polygon-rpc.com'] } },
  },
];
```

### Network Switching

```typescript
// components/network-switcher.tsx
export function NetworkSwitcher() {
  const { chain } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  
  const isWrongNetwork = chain?.id !== FIXED_CHAIN;
  
  if (isWrongNetwork) {
    return (
      <ButtonMagnet 
        onClick={() => switchNetwork?.(FIXED_CHAIN)}
        className="bg-red-500 hover:bg-red-600"
      >
        Switch to Polygon
      </ButtonMagnet>
    );
  }
  
  return null;
}
```

## Error Handling

### Connection Errors

```typescript
// utils/web3-errors.ts
export function handleWeb3Error(error: any) {
  if (error.code === 4001) {
    return 'User rejected the request';
  } else if (error.code === -32002) {
    return 'Request already pending. Please wait.';
  } else if (error.code === -32603) {
    return 'Internal error. Please try again.';
  }
  
  return error.message || 'An unknown error occurred';
}
```

### Transaction Monitoring

```typescript
// hooks/useTransactionStatus.ts
export function useTransactionStatus(hash?: string) {
  const { data: receipt, isLoading } = useWaitForTransaction({
    hash,
    enabled: !!hash,
  });
  
  const status = receipt?.status === 'success' ? 'success' : 
                 receipt?.status === 'reverted' ? 'failed' : 'pending';
  
  return { status, receipt, isLoading };
}
```

## Best Practices

### 1. State Management

- Always clear user state when wallet address changes
- Use localStorage for persistent auth tokens
- Implement proper loading states for async operations

### 2. Error Handling

- Provide clear error messages for users
- Gracefully handle network switching
- Implement retry mechanisms for failed transactions

### 3. Performance

- Use React.memo for expensive components
- Implement proper caching for contract reads
- Debounce rapid state changes

### 4. Security

- Always verify signatures on the backend
- Never store private keys or sensitive data
- Implement proper CORS policies

### 5. User Experience

- Show clear loading states during transactions
- Provide transaction status updates
- Implement optimistic UI updates where appropriate

---

This Web3 integration provides a robust foundation for Waffle's blockchain functionality while maintaining excellent user experience and security standards.
