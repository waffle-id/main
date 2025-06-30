// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BadgeStructs
 * @dev Data structures for the badge system
 */
library BadgeStructs {
    /**
     * @dev Badge data structure
     */
    struct Badge {
        uint256 id;
        string name;
        string description;
        string imageURI;
        uint256 requiredScore;
        bool isActive;
    }

    /**
     * @dev Badge types enum for different categories
     */
    enum BadgeType {
        EARLY_ADOPTER, // First users
        TRUSTED_REVIEWER, // High quality reviewers
        STREAK_MASTER, // Login streak achievements
        GOLDEN_WAFFLE, // High reputation users
        COMMUNITY_BUILDER // Active community members

    }

    /**
     * @dev Badge claim event data
     */
    struct BadgeClaim {
        address user;
        uint256 badgeId;
        uint256 timestamp;
        uint256 tokenId; // NFT token ID for soulbound token
    }
}
