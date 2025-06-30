// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WaffleEnums
 * @dev Enums used throughout the Waffle protocol
 */
library WaffleEnums {
    /**
     * @dev Review rating levels
     */
    enum Rating {
        NEGATIVE,
        NEUTRAL,
        POSITIVE
    }

    /**
     * @dev User status levels
     */
    enum UserStatus {
        UNREGISTERED,
        REGISTERED,
        VERIFIED,
        SUSPENDED,
        BANNED
    }

    /**
     * @dev Badge rarity levels
     */
    enum BadgeRarity {
        COMMON,
        UNCOMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    /**
     * @dev Reputation tier levels
     */
    enum ReputationTier {
        NEWCOMER, // 0-99
        FRESH_WAFFLE, // 100-499
        RISING_STAR, // 500-999
        TRUSTED_BAKER, // 1000-1999
        GOLDEN_WAFFLE, // 2000-4999
        WAFFLE_MASTER // 5000+

    }

    /**
     * @dev Action types for events and logging
     */
    enum ActionType {
        USER_REGISTRATION,
        REVIEW_SUBMITTED,
        BADGE_CLAIMED,
        LOGIN_STREAK_UPDATED,
        REPUTATION_UPDATED
    }
}
