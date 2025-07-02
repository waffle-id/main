export default function BadgesPage() {
  return (
    <div className="my-44 px-[20px] lg:px-[50px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-gray-dark">Earn recognition real community feedback</p>
          <p className="text-black text-5xl">Badges</p>
        </div>
        <div className="grid grid-cols-3 text-black gap-y-12">
          {new Array(5).fill("").map((val, idx) => (
            <div key={idx} className="flex flex-col gap-2 h-full mx-2">
              <p className="font-alt text-2xl">-{idx + 1}</p>
              {/* <div className="aspect-square p-6 bg-red-500"> */}
              <img src="https://placehold.co/10" className="aspect-square object-cover" />
              {/* </div> */}
              <p className="text-3xl">Categories {idx}</p>
              <p className="text-gray-dark">Earn recognition real community feedback</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
