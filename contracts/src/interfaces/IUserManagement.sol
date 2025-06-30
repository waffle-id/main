// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../structs/UserStructs.sol";

/**
 * @title IUserManagement
 * @dev Interface for user registration and profile management
 */
interface IUserManagement {
    /**
     * @dev Register a new user
     */
    function registerUser() external;

    /**
     * @dev Update daily login streak
     */
    function updateLoginStreak() external;

    /**
     * @dev Get user profile information
     * @param user The user address
     * @return UserProfile struct
     */
    function getUserProfile(address user) external view returns (UserStructs.UserProfile memory);

    /**
     * @dev Check if user is registered
     * @param user The user address
     * @return True if user is registered
     */
    function isRegistered(address user) external view returns (bool);

    /**
     * @dev Get user's current login streak
     * @param user The user address
     * @return Current login streak
     */
    function getLoginStreak(address user) external view returns (uint256);

    /**
     * @dev Admin function to grant invitation authority
     * @param user The user address
     * @param hasAuthority Whether to grant authority
     */
    function setInvitationAuthority(address user, bool hasAuthority) external;
}
