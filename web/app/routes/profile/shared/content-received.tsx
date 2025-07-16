import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { Star } from "lucide-react";

type ContentReceivedProps = {
  listData: any[];
};

export function ContentReceived({ listData }: ContentReceivedProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
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
    listData.forEach((_, i) => {
      const el = refs.current[i];
      if (el) {
        const isClamped = el.scrollHeight > el.clientHeight + 2;
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: isClamped,
        }));
      }
    });
  }, [listData]);

  if (listData.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listData.map((val, i) => {
          const isExpanded = expandedIndexes[i];

          return (
            <div key={i} className="p-8 w-full bg-gray-100 rounded-lg">
              <div className="flex flex-row gap-8">
                <div className="relative size-24 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  <img
                    /* @ts-ignore */
                    src={
                      val.avatar ||
                      val.reviewerAccount?.avatarUrl ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        val.reviewerUsername || "default"
                      }`
                    }
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full p-2"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    /* @ts-ignore */
                    to={`/profile/x/${val.reviewerUsername || "unknown"}`}
                    className="text-xl leading-snug hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {/* @ts-ignore */}
                    {val.reviewerUsername || "Unknown"}
                  </Link>
                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={`leading-snug ${isExpanded ? "" : "line-clamp-3"}`}
                  >
                    {/* @ts-ignore */}
                    {val.desc || val.comment}
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
      {listData.length > 0 && (
        <ButtonMagnet className="w-max self-center mt-12" size="lg">
          Load More
        </ButtonMagnet>
      )}
    </div>
  );
}
