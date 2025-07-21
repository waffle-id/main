import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { ABI } from "~/constants/ABI";
import { CA } from "~/constants/CA";
import { useState, useEffect } from "react";

interface UserProfile {
    totalReviews: bigint;
    positiveReviews: bigint;
    neutralReviews: bigint;
    negativeReviews: bigint;
    reputationScore: bigint;
    loginStreak: bigint;
    lastLoginDate: bigint;
    ownedBadges: bigint[];
    hasInvitationAuthority: boolean;
}

/**
 * Hook to manage daily login functionality and streak tracking
 * Following Context7 patterns for clean, professional state management
 */
export function useDailyLogin() {
    const { address } = useAccount();
    const { writeContractAsync, isPending: isSubmitting } = useWriteContract();
    const [hasCheckedToday, setHasCheckedToday] = useState(false);
    const [todayLoginStatus, setTodayLoginStatus] = useState<{
        canLogin: boolean;
        alreadyLoggedToday: boolean;
    }>({ canLogin: false, alreadyLoggedToday: false });

    const [optimisticStreak, setOptimisticStreak] = useState<number | null>(null);

    const {
        data: loginStreak,
        isLoading: isLoadingStreak,
        refetch: refetchStreak,
    } = useReadContract({
        abi: ABI,
        address: CA,
        functionName: "getLoginStreak",
        args: [address],
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        },
    });

    const {
        data: userProfile,
        isLoading: isLoadingProfile,
        refetch: refetchProfile,
    } = useReadContract({
        abi: ABI,
        address: CA,
        functionName: "getUserProfile",
        args: [address],
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        },
    }) as {
        data: UserProfile | undefined;
        isLoading: boolean;
        refetch: () => void;
    };

    useEffect(() => {
        if (!userProfile || !address) {
            setTodayLoginStatus({ canLogin: false, alreadyLoggedToday: false });
            setOptimisticStreak(null);
            return;
        }

        const lastLoginDate = Number(userProfile.lastLoginDate);
        const today = Math.floor(Date.now() / 1000 / 86400);
        const lastLoginDay = Math.floor(lastLoginDate / 86400);

        const alreadyLoggedToday = lastLoginDay === today;
        const canLogin = !alreadyLoggedToday;

        setTodayLoginStatus({
            canLogin,
            alreadyLoggedToday,
        });

        setHasCheckedToday(true);

        if (optimisticStreak !== null) {
            setOptimisticStreak(null);
        }
    }, [userProfile, address, optimisticStreak]);

    const performDailyLogin = async () => {
        if (!address || !todayLoginStatus.canLogin) {
            return { success: false, error: "Cannot login today" };
        }

        try {
            const currentStreakValue = Number(loginStreak || 0);
            const newOptimisticStreak = currentStreakValue + 1;
            setOptimisticStreak(newOptimisticStreak);

            const txHash = await writeContractAsync({
                abi: ABI,
                address: CA,
                functionName: "updateLoginStreak",
            });

            setTodayLoginStatus({
                canLogin: false,
                alreadyLoggedToday: true,
            });

            Promise.all([refetchStreak(), refetchProfile()])
                .then(() => {
                    setOptimisticStreak(null);
                })
                .catch(console.error);

            return { success: true, txHash };
        } catch (error) {
            console.error("Daily login failed:", error);

            setOptimisticStreak(null);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    };

    const getStreakInfo = () => {
        const displayStreak = optimisticStreak !== null ? optimisticStreak : Number(loginStreak || 0);
        const isLoading = isLoadingStreak || isLoadingProfile || !hasCheckedToday;

        return {
            currentStreak: displayStreak,
            isLoading,
            canLoginToday: todayLoginStatus.canLogin,
            alreadyLoggedToday: todayLoginStatus.alreadyLoggedToday,
            isSubmitting,
        };
    };

    return {
        ...getStreakInfo(),
        performDailyLogin,
        userProfile,
    };
}
