import axios from "axios";
import { useLoaderData } from "react-router";

export async function loader() {
  const badges = await axios
    .get("https://api.waffle.food/badges")
    .then<Record<string, string>[]>((resp) => resp.data.data);

  return {
    badges,
  };
}

export default function BadgesPage({}) {
  const loaderData = useLoaderData<typeof loader>();
  const { badges } = loaderData;

  return (
    <div className="my-44 px-[20px] lg:px-[50px]">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-gray-dark">Earn recognition real community feedback</p>
          <p className="text-black text-5xl">Badges</p>
        </div>
        <div className="grid grid-cols-3 text-black gap-y-12">
          {badges.map((val, idx) => (
            <div key={idx} className="flex flex-col gap-2 h-full mx-2">
              <p className="font-alt text-2xl">-{idx + 1}</p>
              <div className="aspect-square p-12 flex items-center justify-center">
                <img src={val.img} className="aspect-square object-contain h-3/4" />
              </div>
              <p className="text-3xl">{val.title}</p>
              <p className="text-gray-dark">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
