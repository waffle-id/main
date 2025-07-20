import { Users } from "lucide-react";
import { Link } from "react-router";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { useState } from "react";

type ContentAllProps = {
  listData: any[];
  currentUser?: {
    username?: string;
    avatarUrl?: string;
  };
};

export function ContentAll({ listData, currentUser }: ContentAllProps) {
  console.log("ContentAll rendered with data:", listData);
  const [visibleCount, setVisibleCount] = useState(10);

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

  const visibleData = listData.slice(0, visibleCount);
  const hasMore = listData.length > visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 w-full text-black text-md">
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Activity</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Date</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Actor</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Subject</p>
        {visibleData.map((activity, idx) => {
          const isReceivedReview = activity.revieweeUsername === currentUser?.username;
          const actorUsername = isReceivedReview
            ? activity.reviewerUsername
            : currentUser?.username;
          const actorAvatarUrl = isReceivedReview
            ? activity.reviewerAccount?.avatarUrl
            : currentUser?.avatarUrl;
          const actorProfilePath = isReceivedReview
            ? activity.reviewerUsername
            : currentUser?.username;

          const subjectUsername = isReceivedReview
            ? currentUser?.username
            : activity.revieweeUsername;
          const subjectAvatarUrl = isReceivedReview
            ? currentUser?.avatarUrl
            : activity.revieweeAccount?.avatarUrl;
          const subjectProfilePath = isReceivedReview
            ? currentUser?.username
            : activity.revieweeUsername;

          return (
            <div key={activity._id || activity.id || idx} className="contents">
              <div className="border-b border-gray-400 border-dashed py-3">
                <div className="flex items-center h-full">
                  <div className="flex flex-row w-max items-center gap-4">
                    <div className="flex flex-col">
                      <p className="font-medium text-sm">
                        Review {isReceivedReview ? "Received" : "Given"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isReceivedReview ? "Feedback from community" : "Your contribution"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-400 border-dashed py-3">
                <div className="flex items-center h-full">
                  <p>
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>
              <div className="border-b border-gray-400 border-dashed py-3">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative size-10 flex-shrink-0">
                    <img
                      className="relative z-10 size-10 aspect-square rounded-full object-cover ring-2 ring-white shadow-md"
                      src={
                        actorAvatarUrl ||
                        `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                          actorUsername || "default"
                        }`
                      }
                      alt=""
                    />
                  </div>
                  <Link
                    to={`/profile/x/${actorProfilePath || "unknown"}`}
                    className="hover:text-blue-600 hover:underline transition-colors cursor-pointer font-medium"
                  >
                    {actorUsername || "Unknown"}
                  </Link>
                </div>
              </div>
              <div className="border-b border-gray-400 border-dashed py-3">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative size-10 flex-shrink-0">
                    <img
                      className="relative z-10 size-10 aspect-square rounded-full object-cover ring-2 ring-white shadow-md"
                      src={
                        subjectAvatarUrl ||
                        `https://api.dicebear.com/9.x/big-smile/svg?seed=${
                          subjectUsername || "default"
                        }`
                      }
                      alt=""
                    />
                  </div>
                  <Link
                    to={`/profile/x/${subjectProfilePath || "unknown"}`}
                    className="hover:text-blue-600 hover:underline transition-colors cursor-pointer font-medium"
                  >
                    {subjectUsername || "Unknown"}
                  </Link>
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
