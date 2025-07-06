import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { cn } from "~/utils/cn";
import {
  ArrowDown,
  BadgeDollarSign,
  CircleSlash,
  MoveDown,
  Pen,
  PencilRuler,
  Share2,
  Wallet,
} from "lucide-react";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";
import { ActionScore } from "./shared/action-score";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

import { ContentReceived } from "./shared/content-received";
import { ContentAll } from "./shared/content-all";
import { ContentGiven } from "./shared/content-given";
import { ImageHoverRevealText } from "~/components/waffle/image-hover-reveal-text";
import { ProfileSkeleton } from "./shared/profile-skeleton";
import Review from "./shared/bottom-sheet/review";
import Vouch from "./shared/bottom-sheet/vouch";
import Slash from "./shared/bottom-sheet/slash";
import { redirect, useParams, useLoaderData } from "react-router";
import type { Route } from "./+types";

const hasToken = typeof window !== "undefined" && !!localStorage.getItem("waffle_auth_token");
export interface UserProfileData {
  address?: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  reputationScore: number;
  hasInvitationAuthority: boolean;
  userPersonaScores?: any[];
  isScraped?: boolean;
}

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

  if (variant === "w" && slug.startsWith("0x")) {
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

    const walletUserData: UserProfileData = {
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
    };
  }

  // review
  const reviewResult = await fetch(`https://api.waffle.food/reviews?revieweeUsername=${slug}`);
  const newImagesItems: ImageItems[] = [];

  // if (reviewResult.ok) {
  const userReview = await reviewResult.json();

  imageItems.map((v, i) => {
    const item = userReview.reviews[i];

    newImagesItems.push({
      ...v,
      // @ts-expect-error aokoskoaks
      reviews: item ? item.comment : v.review,
      src: item ? item.reviewerAccount.avatarUrl : v.src,
    });
  });
  // }

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
        imagesItemsLoader: newImagesItems,
        userReview,
      };
    }
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
  const {
    userData: initialUserData,
    error: initialError,
    needsScraping,
    slug,
    imagesItemsLoader,
    userReview,
  } = loaderData;

  const [userData, setUserData] = React.useState<UserProfileData | null>(initialUserData);
  const [error, setError] = React.useState<string | null>(initialError);
  const [isLoading, setIsLoading] = React.useState(needsScraping);
  const [hasLoggedIn, setHasLoggedIn] = React.useState<boolean | null>(null);

  const TABS = ["received", "given", "all"];
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserData(initialUserData);
    setError(initialError);
    setIsLoading(needsScraping);
    const token = localStorage.getItem("waffle_auth_token");
    setHasLoggedIn(!!token);
  }, [params.variant, params.slug, initialUserData, initialError, needsScraping]);

  useEffect(() => {
    if (!needsScraping) return;

    const fetchScrapedData = async () => {
      try {
        setIsLoading(true);
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
        <p className="text-[8vw] font-bold font-sans m-0">
          {userData.username ||
            (params.slug!!.length > 15
              ? `${params.slug?.slice(0, 6)}...${params.slug?.slice(-4)}`
              : params.slug)}
        </p>
        <CommandLineTypo className="flex flex-row text-xl font-normal m-0 italic items-center gap-2">
          scroll down
          <MoveDown className="size-6" />
        </CommandLineTypo>
      </div>

      <div className="relative z-0 w-full min-h-screen">
        <div ref={gridRef} className="grid grid-cols-8 auto-rows-[1fr] gap-2 w-full mt-32">
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

      <div className="relative z-[10000] h-screen bg-gray-200 text-black flex flex-col items-center justify-center px-4">
        <p className="text-[5vh] max-w-[40ch] leading-snug">
          {userData.bio || "This user prefers to stay mysterious."}
        </p>
        <div className="absolute bottom-0 px-[20px] lg:px-[50px] mb-20 w-full">
          <div className="flex flex-row items-center justify-between">
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
                {userData.fullName && <p className="text-lg text-gray-600">{userData.fullName}</p>}
                {userData.address && (
                  <p className="text-sm text-gray-500">
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

      <div className="px-[20px] lg:px-[50px] py-24 relative z-20 bg-background text-black">
        <div className="flex flex-col gap-12">
          <div
            className={cn(
              "flex flex-row items-center gap-4 justify-end",
              hasLoggedIn ? "" : "pointer-events-none opacity-50"
            )}
          >
            <Review user={userData} />
            <Vouch />
            <Slash />
          </div>
          <Tabs defaultValue={TABS[0]}>
            <TabsList className="w-full mb-5 flex flex-wrap gap-2">
              {TABS.map((val, idx) => (
                <TabsTrigger key={idx} value={val} className="capitalize">
                  {val}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={TABS[0]} className="flex flex-col gap-10">
              {/* @ts-ignore */}
              <ContentGiven listData={userReview ? userReview.reviews : []} />
            </TabsContent>
            <TabsContent value={TABS[1]} className="flex flex-col gap-10">
              <ContentReceived listData={userReview ? userReview.reviews : []} />
            </TabsContent>
            <TabsContent value={TABS[2]} className="flex flex-col gap-10">
              <ContentAll listData={userReview ? userReview.reviews : []} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
