export default function CategoriesPage() {
  return (
    <div className="mt-32 px-[20px] lg:px-[50px]">
      <div className="flex flex-col gap-8">
        <p className="mt-24">Our Lists</p>
        <div className="grid grid-cols-3 text-black">
          {new Array(3).fill("").map((val, idx) => (
            <div key={idx} className="flex flex-col gap-2 h-full mx-2">
              <p className="font-alt text-2xl">-{idx + 1}</p>
              <img src="https://placehold.co/10" className="aspect-[4/5] object-cover" />
              <p className="text-lg">rei_yan__</p>
              <p className="text-sm font-semibold mt-4">read more</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
