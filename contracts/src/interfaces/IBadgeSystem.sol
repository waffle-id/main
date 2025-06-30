// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../structs/BadgeStructs.sol";

/**
 * @title IBadgeSystem
 * @dev Interface for the badge/achievement system
 */
interface IBadgeSystem {
    /**
     * @dev Claim a badge if eligible
     * @param badgeId The badge ID to claim
     */
    function claimBadge(uint256 badgeId) external;

    /**
     * @dev Get badges owned by a user
     * @param user The user address
     * @return Array of badge IDs
     */
    function getUserBadges(address user) external view returns (uint256[] memory);

    /**
     * @dev Get badge details by ID
     * @param badgeId The badge ID
     * @return Badge struct
     */
    function getBadge(uint256 badgeId) external view returns (BadgeStructs.Badge memory);

    /**
     * @dev Check if user has a specific badge
     * @param user The user address
     * @param badgeId The badge ID
     * @return True if user has the badge
     */
    function hasBadge(address user, uint256 badgeId) external view returns (bool);

    /**
     * @dev Get total number of badges in the system
     * @return Total badge count
     */
    function getTotalBadges() external view returns (uint256);

    /**
     * @dev Admin function to create a new badge
     * @param name Badge name
     * @param description Badge description
     * @param imageURI Badge image URI
     * @param requiredScore Required reputation score
     */
    function createBadge(
        string calldata name,
        string calldata description,
        string calldata imageURI,
        uint256 requiredScore
    ) external;

    /**
     * @dev Admin function to toggle badge active status
     * @param badgeId The badge ID
     */
    function toggleBadge(uint256 badgeId) external;
}
