import { CategoriesModel } from "../model";

export async function findAllCategories() {
  // await CategoriesModel.insertMany([
  //   {
  //     title: "Most Credible",
  //     desc: "most credible",
  //     images: "https://ik.imagekit.io/3592mo0vh/waffle/build.svg",
  //   },
  //   {
  //     title: "Least Credible",
  //     desc: "least credible desc",
  //     images: "https://ik.imagekit.io/3592mo0vh/waffle/contrib.svg",
  //   },
  // ]);

  const items = await CategoriesModel.find();
  return items;
}
