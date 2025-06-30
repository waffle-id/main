export default function CategoriesPage() {
  return (
    <div className="my-44 px-[20px] lg:px-[50px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-gray-dark">Our List</p>
          <p className="text-black text-5xl">Categories</p>
        </div>
        <div className="grid grid-cols-3 text-black gap-y-12">
          {new Array(5).fill("").map((val, idx) => (
            <div key={idx} className="flex flex-col gap-2 h-full mx-2">
              <p className="font-alt text-2xl">-{idx + 1}</p>
              <img src="https://placehold.co/10" className="aspect-[4/5] object-cover" />
              <p className="text-lg">Categories {idx}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
