import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router";
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
      username: "emma_dev",
      comment: "Very professional and delivered high-quality work on time.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=grace",
      },
      reviewerUsername: "Exceeded Expectations",
      username: "grace_designer",
      comment:
        "Fantastic communication skills and attention to detail. The final result was better than I imagined and delivered ahead of schedule.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=kent",
      },
      reviewerUsername: "Highly Professional Service",
      username: "kent_coder",
      comment:
        "Outstanding work quality and very responsive throughout the project. Would definitely recommend to others.",
    },
    {
      reviewerAccount: {
        avatarUrl: "https://api.dicebear.com/9.x/big-smile/svg?seed=kent",
      },
      reviewerUsername: "Amazing Results",
      username: "amazing_dev",
      comment: "Perfect execution and great collaboration. Very happy with the outcome.",
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
        console.log(el);
        // const isClamped = el.scrollHeight > el.clientHeight + 1; // small buffer for rounding
        setShouldShowReadMore((prev) => ({
          ...prev,
          [i]: true,
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
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full"></div> */}
                  <img
                    // @ts-ignore
                    src={val.reviewerAccount?.avatarUrl || val.avatar}
                    alt=""
                    className="relative z-10 size-24 aspect-square rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    // @ts-ignore
                    to={`/profile/x/${val.reviewerUsername || "unknown"}`}
                    className="text-xl leading-snug hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {val.reviewerUsername}
                  </Link>
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
