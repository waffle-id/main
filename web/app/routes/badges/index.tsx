import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { cn } from "~/utils/cn";
import { BadgeItem, type BadgeItemProps } from "./badge-item";
import { BadgeHero } from "./hero";
import { ClientOnly } from "remix-utils/client-only";

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
    <div className="mt-16 md:mt-24 lg:mt-32 px-4 md:px-8 lg:px-[50px] min-h-screen mb-16 md:mb-24 lg:mb-32">
      <BadgeHero badges={badges} />

      <div className="my-12 md:my-16 lg:my-24">
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-w-4xl mx-auto">
          {categories.map((category, idx) => (
            <ButtonMagnet
              key={idx}
              className={cn(
                "text-sm md:text-base px-3 md:px-4 py-2",
                selectedCategory === category && "bg-foreground text-white"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </ButtonMagnet>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        <ClientOnly>
          {() => filteredBadges.map((badge, idx) => <BadgeItem key={idx} {...badge} />)}
        </ClientOnly>
      </div>
    </div>
  );
}
