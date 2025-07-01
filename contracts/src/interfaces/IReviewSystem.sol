// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../structs/ReviewStructs.sol";

/**
 * @title IReviewSystem
 * @dev Interface for the review system functionality
 */
interface IReviewSystem {
    /**
     * @dev Submit a review for a user by address
     * @param reviewee The address being reviewed
     * @param rating Rating from 1-3 (1=negative, 2=neutral, 3=positive)
     * @param comment Review comment (max 500 characters)
     */
    function submitReview(address reviewee, uint8 rating, string calldata comment) external;

    /**
     * @dev Submit a review for a user by Twitter username
     * @param username The Twitter username being reviewed
     * @param rating Rating from 1-3 (1=negative, 2=neutral, 3=positive)
     * @param comment Review comment (max 500 characters)
     */
    function submitUsernameReview(string calldata username, uint8 rating, string calldata comment) external;

    /**
     * @dev Submit a review for any entity (unified function)
     * @param revieweeAddress The address being reviewed (use address(0) for username-only)
     * @param revieweeUsername The username being reviewed (use empty string for address-only)
     * @param rating Rating from 1-3 (1=negative, 2=neutral, 3=positive)
     * @param comment Review comment (max 500 characters)
     */
    function submitEntityReview(
        address revieweeAddress,
        string calldata revieweeUsername,
        uint8 rating,
        string calldata comment
    ) external;

    /**
     * @dev Get reviews received by a user
     * @param user The user address
     * @return Array of review IDs
     */
    function getUserReviews(address user) external view returns (uint256[] memory);

    /**
     * @dev Get reviews given by a user
     * @param user The user address
     * @return Array of review IDs
     */
    function getReviewsGiven(address user) external view returns (uint256[] memory);

    /**
     * @dev Get review details by ID
     * @param reviewId The review ID
     * @return Review struct
     */
    function getReview(uint256 reviewId) external view returns (ReviewStructs.Review memory);

    /**
     * @dev Get total number of reviews in the system
     * @return Total review count
     */
    function getTotalReviews() external view returns (uint256);

    /**
     * @dev Get reviews for a non-registered user by username
     * @param username The Twitter username
     * @return Array of review IDs
     */
    function getUsernameReviews(string calldata username) external view returns (uint256[] memory);

    /**
     * @dev Get non-registered user stats by username
     * @param username The Twitter username
     * @return NonRegisteredUser struct with stats
     */
    function getNonRegisteredUser(string calldata username)
        external
        view
        returns (ReviewStructs.NonRegisteredUser memory);

    /**
     * @dev Admin function to verify review (for AI verification)
     * @param reviewId The review ID
     * @param isVerified Verification status
     */
    function verifyReview(uint256 reviewId, bool isVerified) external;
}
