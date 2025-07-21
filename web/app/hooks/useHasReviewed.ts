import { useReadContract, useAccount } from "wagmi";
import { ABI } from "~/constants/ABI";
import { CA } from "~/constants/CA";
import type { UserProfileData } from "~/routes/profile";

/**
 * Hook to check if the current user has already reviewed a specific user
 * Following Context7 patterns for clean, professional state management
 */
export function useHasReviewed(userData: UserProfileData | null) {
    const { address: currentUserAddress } = useAccount();

    const {
        data: hasReviewedAddress,
        isLoading: isLoadingAddressCheck,
        error: addressCheckError,
    } = useReadContract({
        abi: ABI,
        address: CA,
        functionName: "hasUserReviewed",
        args: [currentUserAddress, userData?.address],
        query: {
            enabled: !!(currentUserAddress && userData?.address),
        },
    });

    const {
        data: hasReviewedUsername,
        isLoading: isLoadingUsernameCheck,
        error: usernameCheckError,
    } = useReadContract({
        abi: ABI,
        address: CA,
        functionName: "hasUserReviewedUsername",
        args: [currentUserAddress, userData?.username],
        query: {
            enabled: !!(currentUserAddress && userData?.username && !userData?.address),
        },
    });

    const {
        data: hasReviewedEntity,
        isLoading: isLoadingEntityCheck,
        error: entityCheckError,
    } = useReadContract({
        abi: ABI,
        address: CA,
        functionName: "hasReviewedEntityByHash",
        args: [
            currentUserAddress,
            userData?.address || "0x0000000000000000000000000000000000000000",
            userData?.username || "",
        ],
        query: {
            enabled: !!(currentUserAddress && userData && (userData.address || userData.username)),
        },
    });

    const getReviewStatus = () => {
        if (!currentUserAddress || !userData) {
            return {
                hasReviewed: false,
                isLoading: false,
                error: null,
                canReview: false,
            };
        }

        if (userData.address) {
            return {
                hasReviewed: Boolean(hasReviewedAddress || hasReviewedEntity),
                isLoading: isLoadingAddressCheck || isLoadingEntityCheck,
                error: addressCheckError || entityCheckError,
                canReview: Boolean(currentUserAddress && !hasReviewedAddress && !hasReviewedEntity),
            };
        }

        if (userData.username) {
            return {
                hasReviewed: Boolean(hasReviewedUsername || hasReviewedEntity),
                isLoading: isLoadingUsernameCheck || isLoadingEntityCheck,
                error: usernameCheckError || entityCheckError,
                canReview: Boolean(currentUserAddress && !hasReviewedUsername && !hasReviewedEntity),
            };
        }

        return {
            hasReviewed: false,
            isLoading: false,
            error: null,
            canReview: false,
        };
    };

    return getReviewStatus();
}
