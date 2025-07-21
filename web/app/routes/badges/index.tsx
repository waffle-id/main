import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { cn } from "~/utils/cn";
import { BadgeItem, type BadgeItemProps } from "./badge-item";
import { BadgeHero } from "./hero";
import { ClientOnly } from "remix-utils/client-only";
import type { Route } from "./+types";
import { generateSEO, SEO_CONFIGS } from "~/utils/seo";

export function meta(): Route.MetaDescriptors {
  return generateSEO(SEO_CONFIGS.badges);
}

export async function loader() {
  const badges = await axios
    .get("https://api.waffle.food/badges")
    .then<BadgeItemProps[]>((resp) => resp.data.data)
    .catch((err) => []);

  return { badges };
}

export default function BadgesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { badges } = loaderData;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(badges.map((badge) => badge.category)))];
  const filteredBadges =
    selectedCategory === "All"
      ? badges
      : badges.filter((badge) => badge.category === selectedCategory);

  return (
    <div className="mt-32 px-[20px] lg:px-[50px] min-h-screen mb-32">
      <BadgeHero badges={badges} />

      <div className="my-24">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, idx) => (
            <ButtonMagnet
              key={idx}
              className={cn(selectedCategory === category && "bg-foreground text-white")}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </ButtonMagnet>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ClientOnly>
          {() => filteredBadges.map((badge, idx) => <BadgeItem key={idx} {...badge} />)}
        </ClientOnly>
      </div>
    </div>
  );
}
