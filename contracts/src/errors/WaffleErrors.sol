// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WaffleErrors
 * @dev Custom errors for the Waffle protocol
 */
library WaffleErrors {
    // User Management Errors
    error UserAlreadyRegistered();
    error UserNotRegistered();
    error UserSuspended();
    error UserBanned();
    error InvalidAddress();

    // Review System Errors
    error CannotReviewSelf();
    error ReviewTooFrequent();
    error UserAlreadyReviewed();
    error UsernameAlreadyReviewed();
    error InvalidUsername();
    error InvalidRating();
    error CommentTooLong();
    error CommentEmpty();
    error ReviewNotFound();
    error ReviewAlreadyVerified();

    // Badge System Errors
    error BadgeNotFound();
    error BadgeNotActive();
    error BadgeAlreadyClaimed();
    error NotEligibleForBadge();
    error BadgeNameTooLong();
    error InvalidBadgeRequirements();

    // Login Streak Errors
    error AlreadyLoggedInToday();
    error InvalidLoginDate();

    // Reputation Errors
    error InsufficientReputation();
    error ReputationOverflow();
    error InvalidReputationFactor();

    // Access Control Errors
    error OnlyOwner();
    error OnlyAuthorized();
    error InsufficientPermissions();
    error InvalidCaller();

    // NFT/Soulbound Token Errors
    error SoulboundTokenTransferNotAllowed();
    error SoulboundTokenApprovalNotAllowed();
    error TokenDoesNotExist();

    // General Errors
    error ZeroAddress();
    error InvalidInput();
    error ContractPaused();
    error ContractNotInitialized();
    error ReentrancyGuard();
}
