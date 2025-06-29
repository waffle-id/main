import { Transaction } from "../model";

interface TransactionData {
    amount: number;
    tokenType: string;
    creator: string;
    from: string;
    message: string;
    mediashare: string;
    transactionHash: string;
}

export const createTransaction = async (data: TransactionData) => {
    const transaction = new Transaction(data);
    await transaction.save();

    return transaction;
};