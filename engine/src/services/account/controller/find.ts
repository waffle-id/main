import { UserModel } from "../model";

export async function findAll(
  shouldSort: boolean,
  sortBy: string | null,
  order: string | null,
  skip: number,
  limit: number
) {
  const sortOrder = order?.toLowerCase() === "asc" ? 1 : -1;

  const query = UserModel.find({}).skip(skip).limit(limit);

  if (shouldSort && sortBy) {
    query.sort({ [sortBy]: sortOrder }); // ✅ Apply sort before executing
  }

  const items = await query.exec();
  return items;
}

export async function getTotalUsers() {
  return await UserModel.countDocuments();
}

export async function findByUsername(username: string) {
  const item = await UserModel.findOne({ username }).select(
    "-__v -createdAt -updatedAt -_id"
  );

  return item;
}

export async function findByUsernameFullData(username: string) {
  const item = await UserModel.findOne({ username });

  return item;
}

export async function findByAddressFullData(address: string) {
  const item = await UserModel.findOne({ address });

  return item;
}

export async function findByAddress(address: string) {
  const item = await UserModel.findOne({ address }).select(
    "-__v -createdAt -updatedAt -_id"
  );

  return item;
}
