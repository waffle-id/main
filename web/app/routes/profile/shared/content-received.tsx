import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

type ContentReceivedProps = {
  listData: Record<string, string>[];
};

export function ContentReceived({ listData }: ContentReceivedProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const REVIEWS = [
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=alice",
      title: "Excellent Service Provider",
      username: "alice_pro",
      desc: "Outstanding work quality and very professional communication throughout the project.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=bob",
      title: "Highly Recommended",
      username: "bob_builder",
      desc: "Delivered exactly what was promised on time. Great attention to detail and very responsive to feedback. Would definitely work with them again in the future.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=charlie",
      title: "Professional and Reliable",
      username: "charlie_coder",
      desc: "Amazing experience working together. Clear communication, fast delivery, and exceeded my expectations in every way.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=diana",
      title: "Top Quality Work",
      username: "diana_dev",
      desc: "Very satisfied with the results. Professional approach and great problem-solving skills.",
    },
  ];

  const EXTENDED_REVIEWS = Array.from({ length: 15 }, (_, i) => ({
    ...REVIEWS[i % REVIEWS.length],
  }));

  const combinedData = useMemo(() => {
    return listData.length > 0 ? [...listData, ...EXTENDED_REVIEWS] : EXTENDED_REVIEWS;
  }, [listData]);

  function toggleExpand(index: number) {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  useEffect(() => {
    combinedData.forEach((_, i) => {
      const el = refs.current[i];
      if (el) {
        const isClamped = el.scrollHeight > el.clientHeight + 2; // small buffer for rounding
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: isClamped,
        }));
      }
    });
  }, [combinedData]);

  return (
    <div className="relative flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedData.map((val, i) => {
          const isExpanded = expandedIndexes[i];

          return (
            <div key={i} className="p-8 w-full bg-gray-100 rounded-lg">
              <div className="flex flex-row gap-8">
                <div className="relative size-24 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  <img
                    // @ts-ignore
                    src={val.avatar || val.reviewerAccount?.avatarUrl}
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full p-2"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    // @ts-ignore
                    to={`/profile/x/${val.reviewerUsername || "unknown"}`}
                    className="text-xl leading-snug hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {/* @ts-ignore */}
                    {val.title || val.reviewerUsername}
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
      <ButtonMagnet className="w-max self-center mt-12" size="lg">
        Load More
      </ButtonMagnet>
    </div>
  );
}
