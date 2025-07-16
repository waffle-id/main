import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { MessageSquare } from "lucide-react";

type ContentGivenProps = {
  listData: any[];
};

export function ContentGiven({ listData }: ContentGivenProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(10);
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MessageSquare className="size-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Given</h3>
      <p className="text-gray-500 max-w-md">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleData.map((val, i) => {
          const isExpanded = expandedIndexes[i];

          return (
            <div key={i} className="p-8 w-full bg-gray-100 rounded-lg">
              <div className="flex flex-row gap-8">
                <div className="relative size-24 flex-shrink-0">
                  <img
                    src={
                      val.reviewerAccount?.avatarUrl ||
                      val.avatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        val.reviewerUsername || "default"
                      }`
                    }
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    to={`/profile/x/${val.reviewerUsername || "unknown"}`}
                    className="text-xl leading-snug hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {val.reviewerUsername || "Unknown"}
                  </Link>
                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={`leading-snug ${isExpanded ? "" : "line-clamp-3"}`}
                  >
                    {val.comment}
                  </p>
                  {shouldShowReadMore[i] && (
                    <p
                      className="text-sm font-semibold mt-4 cursor-pointer"
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
