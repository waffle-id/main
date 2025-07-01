// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../structs/UserStructs.sol";
import "../enums/WaffleEnums.sol";

/**
 * @title ReputationLib
 * @dev Library for reputation score calculations
 */
library ReputationLib {
    uint256 public constant BASE_SCORE = 1000;
    uint256 public constant POSITIVE_REVIEW_POINTS = 1;
    uint256 public constant NEUTRAL_REVIEW_POINTS = 0;
    uint256 public constant NEGATIVE_REVIEW_POINTS = 1;
    uint256 public constant STREAK_WEEKLY_BONUS = 25;
    uint256 public constant BADGE_BONUS_MULTIPLIER = 100;

    /**
     * @dev Calculate reputation score based on user data
     * @param profile User profile data
     * @return New reputation score
     */
    function calculateReputationScore(UserStructs.UserProfile memory profile) internal pure returns (uint256) {
        uint256 score = BASE_SCORE;

        // Add points for positive reviews
        score += profile.positiveReviews * POSITIVE_REVIEW_POINTS;

        // Add points for neutral reviews
        score += profile.neutralReviews * NEUTRAL_REVIEW_POINTS;

        // Subtract points for negative reviews (can go below base score)
        uint256 penalty = profile.negativeReviews * NEGATIVE_REVIEW_POINTS;
        if (score >= penalty) {
            score -= penalty;
        } else {
            // If penalty is greater than current score, set to minimum score
            // Allow reputation to go below BASE_SCORE if user gets many negative reviews
            score = 0; // Minimum possible score
        }

        // Add streak bonuses (weekly milestones)
        uint256 weeklyStreaks = profile.loginStreak / 7;
        score += weeklyStreaks * STREAK_WEEKLY_BONUS;

        // Add badge bonuses
        score += profile.ownedBadges.length * BADGE_BONUS_MULTIPLIER;

        return score;
    }

    /**
     * @dev Get reputation tier based on score
     * @param score Reputation score
     * @return Reputation tier enum
     */
    function getReputationTier(uint256 score) internal pure returns (WaffleEnums.ReputationTier) {
        if (score >= 5000) return WaffleEnums.ReputationTier.WAFFLE_MASTER;
        if (score >= 2000) return WaffleEnums.ReputationTier.GOLDEN_WAFFLE;
        if (score >= 1000) return WaffleEnums.ReputationTier.TRUSTED_BAKER;
        if (score >= 500) return WaffleEnums.ReputationTier.RISING_STAR;
        if (score >= 100) return WaffleEnums.ReputationTier.FRESH_WAFFLE;
        return WaffleEnums.ReputationTier.NEWCOMER;
    }

    /**
     * @dev Get tier name as string
     * @param tier Reputation tier
     * @return Tier name
     */
    function getTierName(WaffleEnums.ReputationTier tier) internal pure returns (string memory) {
        if (tier == WaffleEnums.ReputationTier.WAFFLE_MASTER) {
            return "Waffle Master";
        }
        if (tier == WaffleEnums.ReputationTier.GOLDEN_WAFFLE) {
            return "Golden Waffle";
        }
        if (tier == WaffleEnums.ReputationTier.TRUSTED_BAKER) {
            return "Trusted Baker";
        }
        if (tier == WaffleEnums.ReputationTier.RISING_STAR) {
            return "Rising Star";
        }
        if (tier == WaffleEnums.ReputationTier.FRESH_WAFFLE) {
            return "Fresh Waffle";
        }
        return "Newcomer";
    }

    /**
     * @dev Check if score qualifies for badge
     * @param score Current reputation score
     * @param requiredScore Required score for badge
     * @return True if qualified
     */
    function qualifiesForBadge(uint256 score, uint256 requiredScore) internal pure returns (bool) {
        return score >= requiredScore;
    }
}
