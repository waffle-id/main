import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { cn } from "~/utils/cn";
import { MoveDown } from "lucide-react";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";
import { ActionScore } from "./shared/action-score";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import type { Route } from "./+types";
import { getProfileSEO } from "~/utils/seo";
import { fetchUserProfile, checkUserExists, type UserProfile } from "~/services/users";

export function meta({ params, data }: Route.MetaArgs): Route.MetaDescriptors {
  const { variant, slug } = params;
  return getProfileSEO(variant as "x" | "w", slug, data?.userData);
}

import { ContentReceived } from "./shared/content-received";
import { ContentAll } from "./shared/content-all";
import { ContentGiven } from "./shared/content-given";
import { ImageHoverRevealText } from "~/components/waffle/image-hover-reveal-text";
import { ProfileSkeleton } from "./shared/profile-skeleton";
import Review from "./shared/bottom-sheet/review";
import Vouch from "./shared/bottom-sheet/vouch";
import Slash from "./shared/bottom-sheet/slash";
import { redirect, useParams, useLoaderData } from "react-router";
import { ScrapingLoader } from "~/components/waffle/scrape-loader";
import { useWaffleProvider } from "~/components/waffle/waffle-provider";
import { useAccount } from "wagmi";
import { useHasReviewed } from "~/hooks/useHasReviewed";
import { useWalletAuth } from "~/hooks/useWalletAuth";

const isViewingOwnProfile = (
  userData: UserProfile | null,
  currentUser: any,
  walletAddress: string | undefined
): boolean => {
  if (!userData) return false;

  if (userData.username && currentUser?.screen_name) {
    const isTwitterMatch =
      userData.username.toLowerCase() === currentUser.screen_name.toLowerCase();
    if (isTwitterMatch) return true;
  }

  if (userData.address && walletAddress) {
    const isAddressMatch = userData.address.toLowerCase() === walletAddress.toLowerCase();
    if (isAddressMatch) return true;
  }

  return false;
};

interface ScraperProfileData {
  success: boolean;
  data: {
    fullName: string;
    username: string;
    bio: string;
    avatarUrl: string;
    followers: string;
    url: string;
  };
  cached: boolean;
  lastScraped: string;
}

interface ImageItems {
  src?: string;
  r: number;
  c: number;
  review?: string;
}

const imageItems = [
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 1,
    c: 4,
    review:
      "This user provided excellent service and was very professional throughout our interaction. Their communication was clear and they delivered exactly what was promised. Would definitely recommend working with them again.",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 1,
    c: 1,
    review:
      "Great experience overall! Quick response time and quality work. Very satisfied with the outcome.",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 2,
    c: 5,
    review:
      "Professional and reliable. Completed the task efficiently and exceeded my expectations. Highly recommended!",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 3,
    c: 7,
    review:
      "Amazing work quality and attention to detail. Communication was smooth throughout the entire process.",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 3,
    c: 3,
    review:
      "Very helpful and knowledgeable. Went above and beyond to ensure everything was perfect. Thank you!",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 4,
    c: 6,
    review:
      "Outstanding service! Quick turnaround time and excellent quality. Will definitely work together again.",
  },
  {
    src: `https://api.dicebear.com/9.x/big-smile/svg?seed=${Math.floor(Math.random() * 100) + 1}`,
    r: 5,
    c: 2,
    review:
      "Friendly, professional, and delivered exactly what was needed. Great communication throughout the project.",
  },
];

export async function loader({ params }: { params: { variant: string; slug: string } }) {
  const { variant, slug } = params;

  if (variant !== "x" && variant !== "w") {
    return redirect("/");
  }

  if (!slug || (!slug.startsWith("0x") && variant == "w")) {
    return redirect("/");
  }

  const urlREVIEWReceived = `https://api.waffle.food/reviews?${
    variant == "w" ? "revieweeAddress=" : "revieweeUsername="
  }${slug}`;
  const reviewReceivedResult = await fetch(urlREVIEWReceived);

  const urlREVIEWGiven = `https://api.waffle.food/reviews?${
    variant == "w" ? "reviewerAddress=" : "reviewerUsername="
  }${slug}`;
  const reviewGivenResult = await fetch(urlREVIEWGiven);

  const userReviewReceived = await reviewReceivedResult.json();
  const userReviewGiven = await reviewGivenResult.json();

  const allReviews = [...(userReviewReceived?.reviews || []), ...(userReviewGiven?.reviews || [])];

  const userReview = {
    received: userReviewReceived?.reviews || [],
    given: userReviewGiven?.reviews || [],
    all: allReviews,
  };

  const newImagesItems: ImageItems[] = [];
  imageItems.map((v, i) => {
    const item = userReview.received[i];

    newImagesItems.push({
      ...v,
      // @ts-expect-error :p
      reviews: item ? item.comment : v.review,
      src: item ? item.reviewerAccount.avatarUrl : v.src,
    });
  });

  if (variant === "w" && slug.startsWith("0x")) {
    try {
      const checkData = await checkUserExists(slug);

      if (checkData.success && checkData.username) {
        try {
          const profileData = await fetchUserProfile(checkData.username);

          return {
            userData: {
              ...profileData,
              address: slug,
            },
            error: null,
            needsScraping: false,
            slug,
            imagesItemsLoader: newImagesItems,
            userReview,
          };
        } catch (profileError) {
          console.log("Profile fetch failed, falling back to generic wallet profile...");
        }
      }
    } catch (error) {
      console.log("Address check failed, falling back to generic wallet profile...");
    }

    const walletBios = [
      "Early adopter exploring the Web3 ecosystem with passion.",
      "Building the future, one transaction at a time.",
      "Decentralized finance enthusiast and blockchain advocate.",
      "Digital nomad navigating the metaverse landscape.",
      "Crypto researcher focused on innovative protocols.",
      "DeFi strategist with a keen eye for emerging opportunities.",
      "NFT collector and digital art enthusiast.",
      "Blockchain developer contributing to open-source projects.",
      "Web3 pioneer exploring decentralized technologies.",
      "Smart contract auditor ensuring protocol security.",
      "DAO participant shaping decentralized governance.",
      "Yield farmer optimizing across multiple protocols.",
      "On-chain analyst tracking market movements.",
      "Ethereum validator supporting network security.",
      "Cross-chain bridge explorer connecting ecosystems.",
    ];

    const addressHash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bioIndex = addressHash % walletBios.length;

    const walletUserData: UserProfile = {
      address: slug,
      username: `${slug.slice(0, 6)}...${slug.slice(-4)}`,
      fullName: `${slug.slice(0, 6)}...${slug.slice(-4)}`,
      bio: walletBios[bioIndex],
      avatarUrl: `https://api.dicebear.com/9.x/identicon/svg?seed=${slug}`,
      reputationScore: 1000,
      hasInvitationAuthority: false,
    };

    return {
      userData: walletUserData,
      error: null,
      needsScraping: false,
      slug,
      imagesItemsLoader: imageItems,
      userReview,
    };
  }

  try {
    const userData = await fetchUserProfile(slug);
    return {
      userData,
      error: null,
      needsScraping: false,
      slug,
      imagesItemsLoader: newImagesItems,
      userReview,
    };
  } catch (error) {
    console.log("Main API failed or timed out, will try scraper API on client...");
  }

  return {
    userData: null,
    error: null,
    needsScraping: true,
    slug,
    imagesItemsLoader: newImagesItems,
    userReview,
  };
}

export default function Profile() {
  const params = useParams();
  const loaderData = useLoaderData<typeof loader>();
  const { twitterUser } = useWaffleProvider();
  const { address } = useAccount();
  const { checkAuthStatus } = useWalletAuth();

  const {
    userData: initialUserData,
    error: initialError,
    needsScraping,
    slug,
    imagesItemsLoader,
    userReview,
  } = loaderData;

  const [userData, setUserData] = React.useState<UserProfile | null>(initialUserData);
  const [error, setError] = React.useState<string | null>(initialError);
  const [isLoading, setIsLoading] = React.useState(needsScraping);
  const [isScraping, setIsScraping] = React.useState(needsScraping);
  const [hasLoggedIn, setHasLoggedIn] = React.useState<boolean>(false);
  const [authStatus, setAuthStatus] = React.useState<any>(null);

  const isOwnProfile = isViewingOwnProfile(userData, twitterUser, address);

  const { hasReviewed, isLoading: isCheckingReview, canReview } = useHasReviewed(userData);

  const TABS = [
    { value: "received", label: "Received" },
    { value: "given", label: "Given" },
    { value: "all", label: "All" },
  ];
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserData(initialUserData);
    setError(initialError);
    setIsLoading(needsScraping);
    setIsScraping(needsScraping);
  }, [params.variant, params.slug, initialUserData, initialError, needsScraping]);

  useEffect(() => {
    const checkAuth = async () => {
      if (address) {
        try {
          const status = await checkAuthStatus(address);
          setAuthStatus(status);

          const existingToken = localStorage.getItem("waffle_auth_token");
          const isFullyAuthenticated = !!(
            existingToken &&
            status.isRegistered &&
            !status.needsTwitterRegistration
          );

          setHasLoggedIn(isFullyAuthenticated);
        } catch (error) {
          console.error("Auth check failed:", error);

          setAuthStatus(null);
          setHasLoggedIn(false);
        }
      } else {
        setAuthStatus(null);
        setHasLoggedIn(false);
      }
    };

    checkAuth();
  }, [address, twitterUser, checkAuthStatus]);

  useEffect(() => {
    if (!needsScraping) return;

    const fetchScrapedData = async () => {
      try {
        setIsLoading(true);
        setIsScraping(true);
        const scraperResponse = await fetch(
          `https://scraper.waffle.food/profile/${slug}/optimized`
        );

        if (!scraperResponse.ok) {
          throw new Error(`User not found: ${scraperResponse.status}`);
        }

        const scraperData: ScraperProfileData = await scraperResponse.json();

        if (!scraperData.success) {
          throw new Error("Failed to scrape user profile");
        }

        const scrapedUserData: UserProfile = {
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
        setIsScraping(false);
      }
    };

    fetchScrapedData();
  }, [needsScraping, slug]);

  useEffect(() => {
    if (!userData || isLoading) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".grid-item");
    items.forEach((item) => {
      const img = item.querySelector(".grid-item-img");
      if (!img) return;

      const yPercentRandomVal = gsap.utils.random(0, 50);

      gsap
        .timeline()
        .addLabel("start", 0)
        .to(
          item,
          {
            ease: "none",
            borderRadius: "50%",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top top",
              scrub: true,
            },
          },
          "start"
        )
        .to(
          item,
          {
            ease: "none",
            yPercent: yPercentRandomVal,
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
          "start"
        );
    });
  }, [userData, isLoading]);

  if (isScraping) {
    return <ScrapingLoader username={slug} />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <p className="text-gray-600">Failed to load user profile</p>
      </div>
    );
  }

  if (!userData) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10">
        {/* <div className=" flex flex-col gap-4 items-center backdrop-blur-lg rounded-lg p-4"> */}
        <p className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw] font-bold font-sans m-0 px-4 text-center">
          {userData.username ||
            (params.slug!!.length > 15
              ? `${params.slug?.slice(0, 6)}...${params.slug?.slice(-4)}`
              : params.slug)}
        </p>
        <CommandLineTypo className="flex flex-row text-lg sm:text-xl md:text-2xl font-normal m-0 italic items-center gap-2 px-4 text-center">
          scroll down
          <MoveDown className="size-5 sm:size-6" />
        </CommandLineTypo>
      </div>

      <div className="relative z-0 w-full min-h-screen">
        <div ref={gridRef} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 auto-rows-[1fr] gap-1 sm:gap-2 w-full mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-2 sm:px-4 md:px-6 lg:px-8">
          {imagesItemsLoader.map(({ src, review, r, c }, i) => (
            <ImageHoverRevealText
              key={i}
              review={review ?? ""}
              animatableProperties={{
                tx: { current: 0, previous: 0, amt: 0.1 },
                ty: { current: 0, previous: 0, amt: 0.1 },
                rotation: { current: 0, previous: 0, amt: 0.1 },
                brightness: { current: 1, previous: 1, amt: 0.08 },
              }}
              parentStyle={{
                gridRow: r,
                gridColumn: c,
              }}
              parentClassName="grid-item"
            >
              <div className="relative aspect-square w-full">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div> */}
                <img
                  src={src}
                  alt=""
                  className="grid-item-img relative aspect-square w-full p-2 rounded-full"
                />
              </div>
            </ImageHoverRevealText>
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen lg:h-screen bg-gray-200 text-black flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24 lg:pt-0">
        <div className="flex-1 flex flex-col items-center justify-center max-w-full">
          <p className="text-[4vh] sm:text-[4.5vh] md:text-[5vh] lg:text-[5.5vh] xl:text-[6vh] max-w-[90ch] sm:max-w-[80ch] md:max-w-[60ch] lg:max-w-[50ch] xl:max-w-[40ch] leading-tight sm:leading-snug md:leading-normal text-center">
            {userData.bio || "This user prefers to stay mysterious."}
          </p>
        </div>
        <div className="w-full mt-8 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 px-0 lg:px-[50px] mb-0 lg:mb-12 xl:mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 text-center sm:text-left">
              <img
                src={userData.avatarUrl || "https://placehold.co/10"}
                className="size-20 sm:size-24 md:size-28 lg:size-32 rounded-full aspect-square object-cover"
                alt={`${userData.username}'s avatar`}
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <CommandLineTypo className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-light">
                  {userData.username}
                </CommandLineTypo>
                {userData.fullName && <p className="text-sm sm:text-base md:text-lg text-gray-600">{userData.fullName}</p>}
                {userData.address && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {userData.address.slice(0, 6)}...
                    {userData.address.slice(-4)}
                  </p>
                )}
              </div>
            </div>

            <ActionScore
              reputationScore={userData.reputationScore}
              hasInvitationAuthority={userData.hasInvitationAuthority}
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-[20px] xl:px-[50px] py-12 sm:py-16 md:py-20 lg:py-24 relative z-20 bg-background text-black">
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          {!isOwnProfile && (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-end">
              <div
                className={cn(
                  "transition-all duration-300",
                  !canReview && hasLoggedIn && !isCheckingReview
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : "",
                  isCheckingReview ? "opacity-50" : "",
                  !hasLoggedIn ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                )}
                title={
                  isCheckingReview
                    ? "Checking review status..."
                    : !hasLoggedIn
                    ? authStatus?.needsTwitterRegistration
                      ? "Please connect Twitter to review"
                      : "Please connect your wallet and register to review"
                    : hasReviewed
                    ? "You have already reviewed this user"
                    : "Write a review for this user"
                }
              >
                <Review
                  user={userData}
                  disabled={!canReview || !hasLoggedIn || isCheckingReview}
                  hasLoggedIn={hasLoggedIn}
                  hasReviewed={hasReviewed}
                  isCheckingReview={isCheckingReview}
                />
              </div>
              <div
                className={cn(
                  "transition-all duration-300",
                  !hasLoggedIn ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                )}
                title={
                  !hasLoggedIn
                    ? authStatus?.needsTwitterRegistration
                      ? "Please connect Twitter to vouch"
                      : "Please connect your wallet and register to vouch"
                    : "Vouch for this user"
                }
              >
                <Vouch />
              </div>
              <div
                className={cn(
                  "transition-all duration-300",
                  !hasLoggedIn ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                )}
                title={
                  !hasLoggedIn
                    ? authStatus?.needsTwitterRegistration
                      ? "Please connect Twitter to slash"
                      : "Please connect your wallet and register to slash"
                    : "Slash this user"
                }
              >
                <Slash />
              </div>
            </div>
          )}

          {/* <p>{JSON.stringify(userReview)}</p> */}
          <Tabs defaultValue={TABS[0].value}>
            <TabsList className="w-full mb-4 sm:mb-5 flex flex-wrap gap-2">
              {TABS.map((val, idx) => (
                <TabsTrigger key={idx} value={val.value} className="capitalize text-sm sm:text-base">
                  {val.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={TABS[0].value} className="flex flex-col gap-8 sm:gap-10">
              <ContentReceived listData={userReview ? userReview.received : []} />
            </TabsContent>
            <TabsContent value={TABS[1].value} className="flex flex-col gap-8 sm:gap-10">
              <ContentGiven listData={userReview ? userReview.given : []} />
            </TabsContent>
            <TabsContent value={TABS[2].value} className="flex flex-col gap-8 sm:gap-10">
              <ContentAll
                listData={userReview ? userReview.all : []}
                currentUser={{
                  username: userData.username,
                  avatarUrl: userData.avatarUrl,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
