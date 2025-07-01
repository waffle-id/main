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
     * @dev Register a new user with Twitter username
     * @param twitterUsername The Twitter username to link
     */
    function registerUserWithTwitter(string calldata twitterUsername) external;

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

    /**
     * @dev Get the wallet address linked to a Twitter username
     * @param username The Twitter username
     * @return The linked wallet address (address(0) if not linked)
     */
    function getLinkedAddress(string calldata username) external view returns (address);

    /**
     * @dev Get the Twitter username linked to a wallet address
     * @param user The wallet address
     * @return The linked Twitter username (empty string if not linked)
     */
    function getLinkedUsername(address user) external view returns (string memory);
}
