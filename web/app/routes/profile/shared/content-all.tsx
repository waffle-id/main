import { Award, BadgeDollarSign } from "lucide-react";
import { Link } from "react-router";
import { useMemo } from "react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";

type ContentAllProps = {
  listData: Record<string, string>[];
};

export function ContentAll({ listData }: ContentAllProps) {
  const mockActivities = useMemo(
    () =>
      Array.from({ length: 20 }, (_, idx) => ({
        id: `mock-${idx}`,
        type: idx % 2 === 0 ? "vouch" : "review",
        amount: "$2000",
        actorName: `User${String(idx + 1).padStart(3, "0")}`,
        actorUsername: `user${String(idx + 1).padStart(3, "0")}`,
        actorAvatar: `https://api.dicebear.com/9.x/big-smile/svg?seed=actor${idx}`,
        subjectName: `Subject${String(idx + 1).padStart(3, "0")}`,
        subjectUsername: `subject${String(idx + 1).padStart(3, "0")}`,
        subjectAvatar: `https://api.dicebear.com/9.x/big-smile/svg?seed=subject${idx}`,
      })),
    []
  );

  const combinedData = useMemo(() => {
    return listData.length > 0 ? [...listData, ...mockActivities] : mockActivities;
  }, [listData, mockActivities]);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 w-full text-black text-md">
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Activity</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Date</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Actor</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Subject</p>
        {combinedData.map((activity, idx) => (
          <div key={activity.id || idx} className="contents">
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex items-center h-full">
                <div className="flex flex-row w-max items-center gap-4">
                  {/* @ts-ignore */}
                  {(activity.type || (idx % 2 === 0 ? "vouch" : "review")) === "vouch" ? (
                    <>
                      <BadgeDollarSign className="size-5 text-foreground" />
                      <p className="ml-1">Vouch</p>
                    </>
                  ) : (
                    <>
                      <LogoAnimationNoRepeat className="size-5" />
                      <p className="ml-1">Positive Review</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex items-center h-full">
                {/* @ts-ignore */}
                <p>{activity.amount || "$2000"}</p>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-red-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    src={
                      activity.actorAvatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=actor${idx}`
                    }
                    alt=""
                  />
                </div>
                <Link
                  // @ts-ignore
                  to={`/profile/x/${activity.actorName || "unknown"}`}
                  className="hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {/* @ts-ignore */}
                  {activity.actorName || `User${String(idx + 1).padStart(3, "0")}`}
                </Link>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    src={
                      activity.subjectAvatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=subject${idx}`
                    }
                    alt=""
                  />
                </div>
                <Link
                  // @ts-ignore
                  to={`/profile/x/${activity.subjectName || "unknown"}`}
                  className="hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {/* @ts-ignore */}
                  {activity.subjectName || `Subject${String(idx + 1).padStart(3, "0")}`}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ButtonMagnet className="w-max self-center mt-12" size="lg">
        Load More
      </ButtonMagnet>
    </div>
  );
}
