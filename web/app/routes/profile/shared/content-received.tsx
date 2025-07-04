import { useEffect, useRef, useState } from "react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

export function ContentReceived() {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const REVIEWS = [
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=alice",
      title: "Excellent Service Provider",
      desc: "Outstanding work quality and very professional communication throughout the project.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=bob",
      title: "Highly Recommended",
      desc: "Delivered exactly what was promised on time. Great attention to detail and very responsive to feedback. Would definitely work with them again in the future.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=charlie",
      title: "Professional and Reliable",
      desc: "Amazing experience working together. Clear communication, fast delivery, and exceeded my expectations in every way.",
    },
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=diana",
      title: "Top Quality Work",
      desc: "Very satisfied with the results. Professional approach and great problem-solving skills.",
    },
  ];

  const EXTENDED_REVIEWS = Array.from({ length: 15 }, (_, i) => ({
    ...REVIEWS[i % REVIEWS.length],
  }));

  function toggleExpand(index: number) {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  useEffect(() => {
    EXTENDED_REVIEWS.forEach((_, i) => {
      const el = refs.current[i];
      if (el) {
        const isClamped = el.scrollHeight > el.clientHeight + 2; // small buffer for rounding
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: isClamped,
        }));
      }
    });
  }, []);

  return (
    <div className="relative flex flex-col justify-center">
      <div className="columns-2 md:columns-3 gap-10 [column-fill:_balance]">
        {EXTENDED_REVIEWS.map((val, i) => {
          const isExpanded = expandedIndexes[i];

          return (
            <div className="break-inside-avoid p-8 mb-6 w-full h-full bg-gray-100 rounded-lg">
              <div className="flex flex-row gap-8">
                <div className="relative size-24 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  <img
                    src={val.avatar}
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full p-2"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-xl leading-snug">{val.title}</p>
                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={`leading-snug ${isExpanded ? "" : "line-clamp-3"}`}
                  >
                    {val.desc}
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
