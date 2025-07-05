# User Profiles

Waffle supports two types of user profiles: **Twitter profiles** and **Wallet profiles**. This document explains how both profile types work, their features, and implementation details.

## Profile Types

### Twitter Profiles (`/profile/x/{username}`)

Twitter profiles are created when users link their Twitter accounts to Waffle. These profiles provide rich social context and credibility.

**Features:**

- **Social Verification**: Verified Twitter account connection
- **Rich Profile Data**: Bio, avatar, follower count, and tweet history
- **Cross-Platform Identity**: Bridge between Web2 and Web3
- **Enhanced Trust**: Twitter verification adds credibility layer

**Data Sources:**

- **Primary**: Waffle backend API (`api.waffle.food`)
- **Fallback**: Scraper service for public Twitter data
- **Cached**: Scraped data is cached to improve performance

### Wallet Profiles (`/profile/w/{address}`)

Wallet profiles are automatically generated for any Ethereum address. These provide basic Web3 identity without requiring social media connection.

**Features:**

- **Instant Creation**: No registration required
- **On-Chain Data**: Reputation and badges from smart contracts
- **Address Identity**: Shortened address format for display
- **Unique Avatars**: Generated identicon based on address

**Data Sources:**

- **Direct Generation**: Created instantly from address
- **Smart Contracts**: On-chain reputation and badge data
- **No External APIs**: Fully self-contained

## Profile Data Structure

### UserProfileData Interface

```typescript
export interface UserProfileData {
  address?: string;           // Wallet address (optional for Twitter profiles)
  username: string;           // Display name/username
  fullName: string;          // Full name or display name
  bio: string;               // Profile description
  avatarUrl: string;         // Profile image URL
  reputationScore: number;   // Numerical reputation score
  hasInvitationAuthority: boolean; // Can invite new users
  userPersonaScores?: any[]; // Category-specific scores
  isScraped?: boolean;       // Indicates if data was scraped
}
```

## Profile Loading Logic

### Route Handler

```typescript
// routes/profile/index.tsx
export async function loader({ params }: { params: { variant: string; slug: string } }) {
  const { variant, slug } = params;

  // Validate route parameters
  if (variant !== "x" && variant !== "w") {
    return redirect("/");
  }

  if (!slug) {
    return redirect("/");
  }

  // Handle wallet address profiles
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

    return {
      userData: walletUserData,
      error: null,
      needsScraping: false,
      slug,
    };
  }

  // Handle Twitter profiles - try backend API first
  try {
    const response = await fetch(`https://api.waffle.food/account/${slug}`, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const userData: UserProfileData = await response.json();
      return {
        userData,
        error: null,
        needsScraping: false,
        slug,
      };
    }
  } catch (error) {
    console.log("Main API failed, will try scraper on client...");
  }

  // Fallback to scraping
  return {
    userData: null,
    error: null,
    needsScraping: true,
    slug,
  };
}
```

### Client-Side Scraping Fallback

```typescript
// Profile component
useEffect(() => {
  if (!needsScraping) return;

  const fetchScrapedData = async () => {
    try {
      setIsLoading(true);
      const scraperResponse = await fetch(`https://scraper.waffle.food/profile/${slug}`);

      if (!scraperResponse.ok) {
        throw new Error(`User not found: ${scraperResponse.status}`);
      }

      const scraperData: ScraperProfileData = await scraperResponse.json();

      if (!scraperData.success) {
        throw new Error("Failed to scrape user profile");
      }

      const scrapedUserData: UserProfileData = {
        username: scraperData.data.username,
        fullName: scraperData.data.fullName,
        bio: scraperData.data.bio,
        avatarUrl: scraperData.data.avatarUrl,
        reputationScore: 1000,
        hasInvitationAuthority: false,
        isScraped: true,
      };

      setUserData(scrapedUserData);
      setError(null);
    } catch (err) {
      console.error("Error fetching scraped profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  fetchScrapedData();
}, [needsScraping, slug]);
```

## Profile Display Components

### Profile Header

```typescript
// Profile header with adaptive display
<div className="flex flex-row items-center gap-8">
  <img
    src={userData.avatarUrl || "https://placehold.co/10"}
    className="size-32 rounded-full aspect-square object-cover"
    alt={`${userData.username}'s avatar`}
  />
  <div className="flex flex-col gap-2">
    <CommandLineTypo className="text-3xl font-light">
      {userData.username}
    </CommandLineTypo>
    {userData.fullName && (
      <p className="text-lg text-gray-600">{userData.fullName}</p>
    )}
    {userData.address && (
      <p className="text-sm text-gray-500">
        {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
      </p>
    )}
  </div>
</div>
```

### Action Score Display

```typescript
// components/action-score.tsx
export function ActionScore({ 
  reputationScore, 
  hasInvitationAuthority 
}: {
  reputationScore: number;
  hasInvitationAuthority: boolean;
}) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="text-4xl font-bold">
        {reputationScore.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">
        Reputation Score
      </div>
      {hasInvitationAuthority && (
        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          Invitation Authority
        </div>
      )}
    </div>
  );
}
```

## Profile Actions

### Review, Vouch, and Slash

```typescript
// Profile action buttons
<div className="flex flex-row items-center gap-4 justify-end">
  <Review targetUser={userData} />
  <Vouch targetUser={userData} />
  <Slash targetUser={userData} />
</div>
```

### Profile Tabs

```typescript
// Content tabs for reviews
<Tabs defaultValue="received">
  <TabsList className="w-full mb-5 flex flex-wrap gap-2">
    <TabsTrigger value="received">Received</TabsTrigger>
    <TabsTrigger value="given">Given</TabsTrigger>
    <TabsTrigger value="all">All</TabsTrigger>
  </TabsList>
  
  <TabsContent value="received">
    <ContentReceived userId={userData.username} />
  </TabsContent>
  
  <TabsContent value="given">
    <ContentGiven userId={userData.username} />
  </TabsContent>
  
  <TabsContent value="all">
    <ContentAll userId={userData.username} />
  </TabsContent>
</Tabs>
```

## Avatar Generation

### Wallet Address Avatars

```typescript
// Generate unique identicon for wallet addresses
const avatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${address}`;
```

### Twitter Profile Avatars

```typescript
// Use actual Twitter profile image
const avatarUrl = userData.profile_image_url || 
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
```

## State Management

### Route Change Handling

```typescript
// Reset state when route parameters change
useEffect(() => {
  setUserData(initialUserData);
  setError(initialError);
  setIsLoading(needsScraping);
}, [params.variant, params.slug, initialUserData, initialError, needsScraping]);
```

### Loading States

```typescript
// Show skeleton while loading
if (isLoading) {
  return <ProfileSkeleton />;
}

// Show error state
if (error) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500 text-xl">Error: {error}</p>
      <p className="text-gray-600">Failed to load user profile</p>
    </div>
  );
}
```

## SEO and Performance

### Server-Side Rendering

- Profile data is loaded server-side when available
- Immediate rendering for wallet profiles
- Graceful fallback to client-side for Twitter profiles

### Caching Strategy

- Backend API responses are cached
- Scraper data is cached in SQLite
- Static assets are cached with long TTL

### Image Optimization

- Lazy loading for profile images
- Responsive image sizes
- Fallback images for failed loads

## Future Enhancements

### Planned Features

- **ENS Integration**: Display ENS names for wallet addresses
- **Multi-Chain Support**: Profiles across different blockchains
- **Advanced Analytics**: Detailed reputation breakdowns
- **Social Graphs**: Connection visualization between users
- **Activity Feeds**: Real-time activity streams

### Technical Improvements

- **GraphQL**: More efficient data fetching
- **CDN Integration**: Global profile image distribution
- **Search Optimization**: Enhanced profile discoverability
- **Mobile Apps**: Native mobile profile experience

---

The profile system is designed to be flexible, scalable, and user-friendly, supporting both Web2 and Web3 identity paradigms while maintaining excellent performance and user experience.
