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
        address reviewee; // address(0) if non-registered user
        string revieweeUsername; // Twitter username for non-registered users
        uint8 rating; // 1-3 scale (1=negative, 2=neutral, 3=positive)
        string comment;
        uint256 timestamp;
        bool isVerified; // AI verification status
        bool isRegisteredReviewee; // true if reviewee is registered user
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

    /**
     * @dev Non-registered user data structure (Twitter-based)
     */
    struct NonRegisteredUser {
        string username; // Twitter username
        uint256 totalReviews;
        uint256 positiveReviews;
        uint256 neutralReviews;
        uint256 negativeReviews;
        uint256 averageRating; // calculated average * 100 for precision
        bool exists; // to check if username has been reviewed
    }
}
