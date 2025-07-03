import { BadgeModel } from "../model";

export async function findAllBadges() {
  console.log("hit sini kok");

  // await BadgeModel.insertMany([
  //   {
  //     title: "Supportive Soul",
  //     desc: "Awarded to those who uplift and encourage others in the community.",
  //     images: "https://ik.imagekit.io/3592mo0vh/waffle/supportive.svg",
  //   },
  //   {
  //     title: "Contributor",
  //     desc: "Given to members who actively contribute ideas, feedback, or resources.",
  //     images: "https://ik.imagekit.io/3592mo0vh/waffle/contributor.svg",
  //   },
  //   {
  //     title: "Builder",
  //     desc: "Recognizes individuals who create and innovate through hands-on work.",
  //     images: "https://ik.imagekit.io/3592mo0vh/waffle/builder.svg",
  //   },
  // ]);

  const items = await BadgeModel.find();
  return items;
}
