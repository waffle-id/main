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
// import { ContentGiven } from "./shared/content-given";
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

const imageItems = [
  {
    src: "https://placehold.co/500/880808/FFFFFF/png",
    r: 1,
    c: 4,
    review:
      "Sugar plum cupcake lemon drops pastry jelly beans cookie ice cream. Biscuit carrot cake bonbon cupcake candy canes liquorice topping. Bonbon oat cake cake donut chocolate oat cake cupcake. Gummi bears cupcake jujubes dragée sweet croissant oat cake jelly brownie. Caramels brownie brownie chupa chups icing gummies. Sesame snaps bear claw cake jelly-o powder oat cake bear claw. Cotton candy lemon drops oat cake gummies biscuit muffin. Oat cake lemon drops jujubes caramels bonbon cotton candy brownie. Sweet dessert jelly beans wafer jujubes carrot cake jujubes marzipan. Danish dessert macaroon icing jelly cheesecake. Gummi bears sweet roll marzipan gummies carrot cake biscuit chupa chups. Tart croissant gummi bears jujubes bear claw. Cake candy soufflé oat cake bear claw gingerbread marshmallow cotton candy.",
  },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 1, c: 1, review: "Lorem 2" },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 2, c: 5, review: "Lorem 4" },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 3, c: 7, review: "Lorem 3" },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 3, c: 3, review: "Lorem 5" },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 4, c: 6, review: "Lorem 6" },
  { src: "https://placehold.co/500/880808/FFFFFF/png", r: 5, c: 2, review: "Lorem 7" },
];

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

export async function loader({ params }: { params: { variant: string; slug: string } }) {
  const { variant, slug } = params;

  if (variant !== "x" && variant !== "w") {
    return redirect("/");
  }

  if (!slug) {
    return redirect("/");
  }

  try {
    const response = await fetch(`https://api.waffle.food/account/${slug}`, {
      signal: AbortSignal.timeout(5000),
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
    console.log("Main API failed or timed out, will try scraper API on client...");
  }

  return {
    userData: null,
    error: null,
    needsScraping: true,
    slug,
  };
}

export default function Profile() {
  const params = useParams();
  const loaderData = useLoaderData<typeof loader>();
  const { userData: initialUserData, error: initialError, needsScraping, slug } = loaderData;

  const [userData, setUserData] = React.useState<UserProfileData | null>(initialUserData);
  const [error, setError] = React.useState<string | null>(initialError);
  const [isLoading, setIsLoading] = React.useState(needsScraping);

  const TABS = ["received", "given", "all"];
  const gridRef = useRef<HTMLDivElement>(null);

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
          {imageItems.map(({ src, review, r, c }, i) => (
            <ImageHoverRevealText
              key={i}
              review={review}
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
              <img src={src} alt="" className="grid-item-img aspect-square w-full" />
            </ImageHoverRevealText>
          ))}
        </div>
      </div>

      <div className="relative z-[10000] h-screen bg-gray-200 text-black flex flex-col items-center justify-center px-4">
        <p className="text-[5vh] max-w-[40ch] leading-snug">
          {userData.bio || "use me as a bad example"}
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
                    {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
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
          <div className="flex flex-row items-center gap-4 justify-end">
            <Review />
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
              <ContentGiven />
            </TabsContent>
            <TabsContent value={TABS[1]} className="flex flex-col gap-10">
              <ContentReceived />
            </TabsContent>
            <TabsContent value={TABS[2]} className="flex flex-col gap-10">
              <ContentAll />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
