import { Award, BadgeDollarSign, Users } from "lucide-react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";

type ContentAllProps = {
  listData: any[];
};

export function ContentAll({ listData }: ContentAllProps) {
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Users className="size-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Activity Yet</h3>
      <p className="text-gray-500 max-w-md">
        There's no activity to display at the moment. Once there are reviews or vouches, they'll
        appear here.
      </p>
    </div>
  );

  if (listData.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 w-full text-black text-md">
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Activity</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Date</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Actor</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Subject</p>
        {listData.map((activity, idx) => (
          <div key={activity.id || idx} className="contents">
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex items-center h-full">
                <div className="flex flex-row w-max items-center gap-4">
                  {/* @ts-ignore */}
                  {activity.type === "vouch" ? (
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
                <p>{activity.amount || activity.date || "-"}</p>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-red-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    /* @ts-ignore */
                    src={
                      activity.actorAvatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        activity.actorName || "default"
                      }`
                    }
                    alt=""
                  />
                </div>
                <Link
                  /* @ts-ignore */
                  to={`/profile/x/${activity.actorUsername || activity.actorName || "unknown"}`}
                  className="hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {/* @ts-ignore */}
                  {activity.actorName || activity.actorUsername || "Unknown"}
                </Link>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    /* @ts-ignore */
                    src={
                      activity.subjectAvatar ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                        activity.subjectName || "default"
                      }`
                    }
                    alt=""
                  />
                </div>
                <Link
                  /* @ts-ignore */
                  to={`/profile/x/${activity.subjectUsername || activity.subjectName || "unknown"}`}
                  className="hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {/* @ts-ignore */}
                  {activity.subjectName || activity.subjectUsername || "Unknown"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {listData.length > 0 && (
        <ButtonMagnet className="w-max self-center mt-12" size="lg">
          Load More
        </ButtonMagnet>
      )}
    </div>
  );
}
