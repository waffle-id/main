import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { ABI } from "~/constants/ABI";
import { CA } from "~/constants/CA";
import type { Hash } from "viem";

export function useContractRegistration() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    const publicClient = usePublicClient();

    const {
        writeContract,
        isPending: isWritePending,
        data: transactionHash,
        error: writeError,
        isSuccess: isWriteSuccess,
    } = useWriteContract();

    const {
        isLoading: isTxLoading,
        isSuccess: isTxSuccess,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash: transactionHash,
    });

    useEffect(() => {
        if (writeError) {
            console.error("Write contract error:", writeError);
            setRegistrationError(writeError.message);
            setIsRegistering(false);
        }
    }, [writeError]);

    useEffect(() => {
        if (receiptError) {
            console.error("Transaction receipt error:", receiptError);
            setRegistrationError(receiptError.message);
            setIsRegistering(false);
        }
    }, [receiptError]);

    useEffect(() => {
        if (transactionHash) {
            console.log("Transaction states:", {
                hash: transactionHash,
                isLoading: isTxLoading,
                isSuccess: isTxSuccess,
                hasError: !!receiptError,
            });
        }
    }, [transactionHash, isTxLoading, isTxSuccess, receiptError]);

    const registerUser = async (): Promise<{
        success: boolean;
        txHash?: Hash;
        error?: string;
    }> => {
        setIsRegistering(true);
        setRegistrationError(null);

        try {
            console.log("Calling registerUser on smart contract...");

            writeContract({
                address: CA,
                abi: ABI,
                functionName: "registerUser",
                args: [],
            });

            return new Promise((resolve) => {
                const checkStatus = () => {
                    if (writeError || receiptError) {
                        const error = writeError || receiptError;
                        setIsRegistering(false);
                        resolve({
                            success: false,
                            error: error?.message || "Transaction failed",
                        });
                        return;
                    }

                    if (isTxSuccess && transactionHash) {
                        console.log("Transaction confirmed:", transactionHash);
                        setIsRegistering(false);
                        resolve({
                            success: true,
                            txHash: transactionHash,
                        });
                        return;
                    }

                    setTimeout(checkStatus, 500);
                };

                setTimeout(checkStatus, 100);

                setTimeout(() => {
                    if (isRegistering) {
                        setIsRegistering(false);
                        resolve({
                            success: false,
                            error: "Transaction timeout",
                        });
                    }
                }, 120000);
            });
        } catch (error) {
            console.error("Contract registration failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setRegistrationError(errorMessage);
            setIsRegistering(false);

            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    return {
        registerUser,
        isRegistering: isRegistering || isWritePending || isTxLoading,
        registrationError,
        txHash: transactionHash,
        isConfirming: isTxLoading,
        isConfirmed: isTxSuccess,
        isWritePending,
    };
}
