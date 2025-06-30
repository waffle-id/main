import { useEffect, useRef, useState } from "react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

export function ContentGiven() {
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});
  const [shouldShowReadMore, setShouldShowReadMore] = useState<Record<number, boolean>>({});
  const refs = useRef<Record<number, HTMLParagraphElement | null>>({});

  const REVIEWS = [
    {
      avatar: "https://placehold.co/10",
      title: "Lorem Ipsum Dolor Sit Amet",
      desc: "Cupcake ipsum dolor sit amet pastry icing jelly.",
    },
    {
      avatar: "https://placehold.co/10",
      title: "Cupcake",
      desc: "Cupcake ipsum dolor sit amet pastry icing jelly. Pastry lollipop marzipan toffee soufflé macaroon carrot cake chocolate cake. I love toffee sugar plum soufflé cookie",
    },
    {
      avatar: "https://placehold.co/10",
      title: "Lorem Ipsum Dolor Sit Amet",
      desc: "Tart caramels I love gummi bears toffee. Fruitcake chocolate sugar plum gummi bears powder bear claw candy lollipop cheesecake. Cookie icing sesame snaps I love cookie.",
    },
    {
      avatar: "https://placehold.co/10",
      title: "Lorem Ipsum Dolor Sit Amet",
      desc: "Candy canes brownie candy I love dragée sugar plum chocolate candy canes pudding.",
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
                <img src={val.avatar} alt="" className="size-24 aspect-square rounded-full" />
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
