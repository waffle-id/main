// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReviewStructs
 * @dev Data structures for the review system
 */
library ReviewStructs {
    /**
     * @dev Review data structure
     */
    struct Review {
        uint256 id;
        address reviewer;
        address reviewee;
        uint8 rating; // 1-3 scale (1=negative, 2=neutral, 3=positive)
        string comment;
        uint256 timestamp;
        bool isVerified; // AI verification status
    }

    /**
     * @dev Review statistics for a user
     */
    struct ReviewStats {
        uint256 totalReviews;
        uint256 positiveReviews; // rating == 3
        uint256 neutralReviews; // rating == 2
        uint256 negativeReviews; // rating == 1
        uint256 averageRating; // calculated average * 100 for precision
    }
}
