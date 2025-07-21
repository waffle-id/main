import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "~/utils/cn";

type ContentGivenProps = {
  listData: any[];
};

const getRatingStyles = (rating: string) => {
  switch (rating?.toLowerCase()) {
    case "positive":
      return {
        icon: TrendingUp,
        containerClass: "bg-emerald-100 text-emerald-600 border border-emerald-200",
        iconClass: "text-emerald-600",
      };
    case "negative":
      return {
        icon: TrendingDown,
        containerClass: "bg-rose-100 text-rose-600 border border-rose-200",
        iconClass: "text-rose-600",
      };
    case "neutral":
      return {
        icon: Minus,
        containerClass: "bg-amber-100 text-amber-600 border border-amber-200",
        iconClass: "text-amber-600",
      };
    default:
      return {
        icon: Minus,
        containerClass: "bg-slate-100 text-slate-600 border border-slate-200",
        iconClass: "text-slate-600",
      };
  }
};

export function ContentGiven({ listData }: ContentGivenProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(10);
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
      <MessageSquare className="size-12 sm:size-14 md:size-16 text-gray-400 mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-600 mb-2">No Reviews Given</h3>
      <p className="text-gray-500 max-w-md text-sm sm:text-base px-4">
        No reviews have been given yet. Once reviews are submitted, they'll be displayed here.
      </p>
    </div>
  );

  function toggleExpand(index: number) {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  useEffect(() => {
    const visibleData = listData.slice(0, visibleCount);
    visibleData.forEach((_, i) => {
      const el = refs.current[i];
      if (el) {
        const isClamped = el.scrollHeight > el.clientHeight + 2;
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: isClamped,
        }));
      }
    });
  }, [listData, visibleCount]);

  if (listData.length === 0) {
    return <EmptyState />;
  }

  const visibleData = listData.slice(0, visibleCount);
  const hasMore = listData.length > visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="relative flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {visibleData.map((val, i) => {
          const isExpanded = expandedIndexes[i];
          const ratingStyles = getRatingStyles(val.rating);
          const IconComponent = ratingStyles.icon;

          return (
            <div
              key={i}
              className={cn(
                "p-4 sm:p-6 md:p-8 w-full rounded-xl relative transition-all duration-300 ease-out bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 sm:top-4 sm:right-4 sm:w-8 sm:h-8 md:top-6 md:right-6 md:w-9 md:h-9",
                  ratingStyles.containerClass
                )}
              >
                <IconComponent
                  className={cn("w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5", ratingStyles.iconClass)}
                  strokeWidth={2.5}
                />
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="relative size-16 sm:size-20 md:size-24 flex-shrink-0 mx-auto">
                  <img
                    src={
                      val.revieweeAccount?.[0].avatarUrl ||
                      val.avatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        val.revieweeUsername || "default"
                      }`
                    }
                    alt=""
                    className="relative z-10 size-16 sm:size-20 md:size-24 aspect-square rounded-full object-cover ring-2 ring-white shadow-lg"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-w-0 text-center">
                  <Link
                    to={`/profile/x/${val.revieweeUsername || "unknown"}`}
                    className={cn(
                      "text-base sm:text-lg md:text-xl leading-snug hover:underline transition-colors cursor-pointer font-medium"
                    )}
                  >
                    {val.revieweeUsername || "Unknown"}
                  </Link>
                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={cn(
                      "leading-relaxed text-slate-700 text-sm sm:text-base",
                      isExpanded ? "" : "line-clamp-3"
                    )}
                  >
                    {val.comment}
                  </p>
                  {shouldShowReadMore[i] && (
                    <p
                      className={cn(
                        "text-sm font-semibold mt-2 cursor-pointer transition-colors"
                      )}
                      onClick={() => toggleExpand(i)}
                    >
                      {isExpanded ? "show less" : "read more"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <ButtonMagnet className="w-max self-center mt-8 sm:mt-12" size="lg" onClick={loadMore}>
          Load More
        </ButtonMagnet>
      )}
    </div>
  );
}
