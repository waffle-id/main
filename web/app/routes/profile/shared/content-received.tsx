import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "~/utils/cn";

type ContentReceivedProps = {
  listData: any[];
};

function getRatingStyles(rating: string) {
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
}

export function ContentReceived({ listData }: ContentReceivedProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(10);
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Star className="size-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Received</h3>
      <p className="text-gray-500 max-w-md">
        No reviews have been received yet. Once others review this profile, they'll appear here.
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {visibleData.map((val, i) => {
          const isExpanded = expandedIndexes[i];
          const ratingStyles = getRatingStyles(val.rating);
          const IconComponent = ratingStyles.icon;

          return (
            <div
              key={i}
              className={cn(
                "p-6 sm:p-8 w-full rounded-xl relative transition-all duration-300 ease-out bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 sm:top-6 sm:right-6 sm:w-9 sm:h-9",
                  ratingStyles.containerClass
                )}
              >
                <IconComponent
                  className={cn("w-4 h-4 sm:w-5 sm:h-5", ratingStyles.iconClass)}
                  strokeWidth={2.5}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="relative size-20 sm:size-24 flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={
                      val.avatar ||
                      val.reviewerAccount?.avatarUrl ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        val.reviewerUsername || "default"
                      }`
                    }
                    alt=""
                    className="relative z-10 size-20 sm:size-24 aspect-square rounded-full object-cover ring-2 ring-white shadow-lg"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-w-0">
                  <Link
                    to={`/profile/x/${val.reviewerUsername || "unknown"}`}
                    className={cn(
                      "text-lg sm:text-xl leading-snug hover:underline transition-colors cursor-pointer font-medium text-center sm:text-left"
                    )}
                  >
                    {val.reviewerUsername || "Unknown"}
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
                    {val.desc || val.comment}
                  </p>
                  {shouldShowReadMore[i] && (
                    <p
                      className={cn(
                        "text-sm font-semibold mt-2 cursor-pointer transition-colors text-center sm:text-left"
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
        <ButtonMagnet className="w-max self-center mt-12" size="lg" onClick={loadMore}>
          Load More
        </ButtonMagnet>
      )}
    </div>
  );
}
