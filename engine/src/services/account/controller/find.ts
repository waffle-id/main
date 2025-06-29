import { UserModel } from "../model";

export async function findAll() {
  const items = await UserModel.find();
  return items;
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
