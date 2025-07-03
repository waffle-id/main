import axios from "axios";
import { NavLink, useLoaderData } from "react-router";
import { cn } from "~/utils/cn";

export async function loader() {
  const categories = await axios
    .get("https://api.waffle.food/categories")
    .then<Record<string, string>[]>((resp) => resp.data.data);

  return {
    categories,
  };
}

export default function CategoriesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { categories } = loaderData;

  return (
    <div className="my-44 px-[20px] lg:px-[50px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-gray-dark">Our List</p>
          <p className="text-black text-5xl">Categories</p>
        </div>
        <div className="grid grid-cols-3 text-black gap-y-12">
          {categories.map((val, idx) => (
            <NavLink key={idx} to={`/leaderboard/${val.title.split(" ").join("-").toLowerCase()}`}>
              <div className="flex flex-col gap-2 h-full mx-2">
                <p className="font-alt text-2xl">-{idx + 1}</p>

                <div
                  className={cn(
                    "relative aspect-square p-12 flex items-center justify-center",
                    idx == 0 && "p-24"
                  )}
                >
                  <img src={val.images} className="aspect-[4/5] object-contain h-full" />
                  <p className="absolute m-auto backdrop-blur-2xl py-4 px-6 text-3xl">
                    image should be changed
                  </p>
                </div>
                <p className="text-lg">{val.title}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
