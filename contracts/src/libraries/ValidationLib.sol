// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ValidationLib
 * @dev Library for input validation and security checks
 */
library ValidationLib {
    uint256 public constant MAX_COMMENT_LENGTH = 500;
    uint256 public constant MIN_RATING = 1;
    uint256 public constant MAX_RATING = 3;
    uint256 public constant MAX_BADGE_NAME_LENGTH = 50;
    uint256 public constant MAX_BADGE_DESCRIPTION_LENGTH = 200;
    uint256 public constant MAX_USERNAME_LENGTH = 15; // Twitter username max length
    uint256 public constant MIN_USERNAME_LENGTH = 1;

    /**
     * @dev Validate review input parameters for registered users
     * @param reviewer Address submitting the review
     * @param reviewee Address being reviewed
     * @param rating Review rating (1-3)
     * @param comment Review comment
     * @return True if valid
     */
    function validateReviewInput(address reviewer, address reviewee, uint8 rating, string memory comment)
        internal
        pure
        returns (bool)
    {
        // Check addresses
        if (reviewer == address(0) || reviewee == address(0)) return false;
        if (reviewer == reviewee) return false;

        // Check rating range
        if (rating < MIN_RATING || rating > MAX_RATING) return false;

        // Check comment length
        if (bytes(comment).length == 0 || bytes(comment).length > MAX_COMMENT_LENGTH) return false;

        return true;
    }

    /**
     * @dev Validate review input parameters for non-registered users (Twitter username)
     * @param reviewer Address submitting the review
     * @param username Twitter username being reviewed
     * @param rating Review rating (1-3)
     * @param comment Review comment
     * @return True if valid
     */
    function validateUsernameReviewInput(address reviewer, string memory username, uint8 rating, string memory comment)
        internal
        pure
        returns (bool)
    {
        // Check reviewer address
        if (reviewer == address(0)) return false;

        // Check username
        if (!isValidUsername(username)) return false;

        // Check rating range
        if (rating < MIN_RATING || rating > MAX_RATING) return false;

        // Check comment length
        if (bytes(comment).length == 0 || bytes(comment).length > MAX_COMMENT_LENGTH) return false;

        return true;
    }

    /**
     * @dev Validate badge creation parameters
     * @param name Badge name
     * @param description Badge description
     * @param requiredScore Required reputation score
     * @return True if valid
     */
    function validateBadgeInput(string memory name, string memory description, uint256 requiredScore)
        internal
        pure
        returns (bool)
    {
        // Check name length
        if (bytes(name).length == 0 || bytes(name).length > MAX_BADGE_NAME_LENGTH) return false;

        // Check description length
        if (bytes(description).length == 0 || bytes(description).length > MAX_BADGE_DESCRIPTION_LENGTH) return false;

        // Check required score is reasonable
        if (requiredScore == 0 || requiredScore > 10000) return false;

        return true;
    }

    /**
     * @dev Check if user has already reviewed another user
     * @param hasReviewed True if reviewer has already reviewed reviewee
     * @return True if can review (hasn't reviewed before)
     */
    function canReviewUser(bool hasReviewed) internal pure returns (bool) {
        return !hasReviewed;
    }

    /**
     * @dev Validate Ethereum address
     * @param addr Address to validate
     * @return True if valid address
     */
    function isValidAddress(address addr) internal pure returns (bool) {
        return addr != address(0);
    }

    /**
     * @dev Check if login streak is valid for today
     * @param lastLoginDate Last login timestamp
     */
    function validateLoginStreak(uint256 lastLoginDate) internal view returns (bool canUpdate, bool isDayMissed) {
        uint256 today = block.timestamp / 1 days;
        uint256 lastLogin = lastLoginDate / 1 days;

        uint256 daysDifference = today - lastLogin;

        canUpdate = daysDifference > 0; // Can only update if it's a new day
        isDayMissed = daysDifference > 1; // Streak broken if more than 1 day

        return (canUpdate, isDayMissed);
    }

    /**
     * @dev Sanitize string input (remove control characters)
     * @param input Input string
     * @return Sanitized string
     */
    function sanitizeString(string memory input) internal pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        bytes memory result = new bytes(inputBytes.length);
        uint256 resultLength = 0;

        for (uint256 i = 0; i < inputBytes.length; i++) {
            bytes1 char = inputBytes[i];
            // Allow printable ASCII characters (32-126) and some common unicode
            if (uint8(char) >= 32 && uint8(char) <= 126) {
                result[resultLength] = char;
                resultLength++;
            }
        }

        // Resize the result array
        bytes memory finalResult = new bytes(resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            finalResult[i] = result[i];
        }

        return string(finalResult);
    }

    /**
     * @dev Validate Twitter username format
     * @param username Username to validate
     * @return True if valid Twitter username
     */
    function isValidUsername(string memory username) internal pure returns (bool) {
        bytes memory usernameBytes = bytes(username);

        // Check length
        if (usernameBytes.length < MIN_USERNAME_LENGTH || usernameBytes.length > MAX_USERNAME_LENGTH) {
            return false;
        }

        // Check each character
        for (uint256 i = 0; i < usernameBytes.length; i++) {
            bytes1 char = usernameBytes[i];

            // Allow alphanumeric characters and underscore
            if (
                // 0-9
                // A-Z
                // a-z
                !(
                    (char >= 0x30 && char <= 0x39) || (char >= 0x41 && char <= 0x5A) || (char >= 0x61 && char <= 0x7A)
                        || char == 0x5F
                ) // underscore
            ) {
                return false;
            }
        }

        return true;
    }
}
