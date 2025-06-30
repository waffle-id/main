// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UserStructs
 * @dev Data structures for user management
 */
library UserStructs {
    /**
     * @dev User profile data structure
     */
    struct UserProfile {
        uint256 totalReviews;
        uint256 positiveReviews;
        uint256 neutralReviews;
        uint256 negativeReviews;
        uint256 reputationScore;
        uint256 loginStreak;
        uint256 lastLoginDate;
        uint256[] ownedBadges;
        bool hasInvitationAuthority;
    }

    /**
     * @dev Login streak data
     */
    struct LoginData {
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastLoginDate;
        uint256 totalLogins;
    }

    /**
     * @dev Reputation calculation factors
     */
    struct ReputationFactors {
        uint256 baseScore;
        uint256 reviewMultiplier;
        uint256 streakBonus;
        uint256 badgeBonus;
        uint256 penaltyPoints;
    }
}
