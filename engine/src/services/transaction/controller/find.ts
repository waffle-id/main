import { Transaction } from "../model";

export const getAllTransactions = async (query: any = {}, limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return {
    success: true,
    data: transactions,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTransactionById = async (id: string) => {
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return {
    success: true,
    data: transaction,
  };
};

export const getTransactionsByCreator = async (
  creator: string,
  limit: number = 10,
  page: number = 1
) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({ creator })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments({ creator });

  return {
    success: true,
    data: transactions,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
