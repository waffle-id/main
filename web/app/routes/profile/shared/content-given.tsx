import { useEffect, useRef, useState } from "react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

type ContentGivenProps = {
  listData: Record<string, string>[];
};

export function ContentGiven({ listData }: ContentGivenProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const REVIEWS = [
    {
      avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=emma",

      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=emma",
      },
      reviewerUsername: "Great Experience Working Together",
      comment: "Very professional and delivered high-quality work on time.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=grace",
      },
      reviewerUsername: "Exceeded Expectations",
      comment:
        "Fantastic communication skills and attention to detail. The final result was better than I imagined and delivered ahead of schedule.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=kent",
      },
      reviewerUsername: "Highly Professional Service",
      comment:
        "Outstanding work quality and very responsive throughout the project. Would definitely recommend to others.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=kent",
      },
      reviewerUsername: "Amazing Results",
      comment: "Perfect execution and great collaboration. Very happy with the outcome.",
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
        console.log(el);
        // const isClamped = el.scrollHeight > el.clientHeight + 1; // small buffer for rounding
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: true,
        }));
      }
    });
  }, []);

  return (
    <div className="relative flex flex-col justify-center">
      <div className="columns-2 md:columns-3 gap-10 [column-fill:_balance]">
        {(listData.length > 10 ? listData : [...listData, ...EXTENDED_REVIEWS]).map((val, i) => {
          const isExpanded = expandedIndexes[i];

          return (
            <div
              key={i}
              className="break-inside-avoid p-8 mb-6 w-full h-full bg-gray-100 rounded-lg"
            >
              <div className="flex flex-row gap-8">
                <div className="relative size-24 flex-shrink-0">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full"></div> */}
                  <img
                    // @ts-ignore
                    src={val.reviewerAccount.avatarUrl}
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-xl leading-snug">{val.reviewerUsername}</p>
                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    // className={`leading-snug ${isExpanded ? "" : "line-clamp-6"}`}
                    className={`leading-snug`}
                  >
                    {val.comment}
                  </p>
                  {/* {shouldShowReadMore[i] && (
                    <p
                      className="text-sm font-semibold mt-4 cursor-pointer"
                      onClick={() => toggleExpand(i)}
                    >
                      {isExpanded ? "show less" : "read more"}
                    </p>
                  )} */}
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
