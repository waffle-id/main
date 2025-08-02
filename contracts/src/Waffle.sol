// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "./interfaces/IReviewSystem.sol";
import "./interfaces/IBadgeSystem.sol";
import "./interfaces/IUserManagement.sol";
import "./structs/ReviewStructs.sol";
import "./structs/BadgeStructs.sol";
import "./structs/UserStructs.sol";
import "./enums/WaffleEnums.sol";
import "./libraries/ReputationLib.sol";
import "./libraries/ValidationLib.sol";
import "./errors/WaffleErrors.sol";

/**
 * @title Waffle - Reputation-as-a-Protocol Platform
 * @dev Main contract implementing reputation system with reviews, badges, and login streaks
 * @author We3ster Team
 */
contract Waffle is ERC721, Ownable, ReentrancyGuard, Pausable, IReviewSystem, IBadgeSystem, IUserManagement {
    using ReputationLib for UserStructs.UserProfile;
    using ValidationLib for string;

    // ============ State Variables ============

    uint256 private _reviewIds;
    uint256 private _badgeIds;
    uint256 private _tokenIds;

    // Core mappings
    mapping(uint256 => ReviewStructs.Review) public reviews;
    mapping(uint256 => BadgeStructs.Badge) public badges;
    mapping(address => UserStructs.UserProfile) public userProfiles;
    mapping(address => bool) public isRegistered;

    // User linking mappings
    mapping(address => string) public addressToUsername; // wallet => twitter username
    mapping(string => address) public usernameToAddress; // twitter username => wallet

    // Review system mappings
    mapping(address => uint256[]) public userReviews; // reviews received
    mapping(address => uint256[]) public reviewsGiven; // reviews given
    mapping(address => mapping(address => bool)) public hasReviewed; // one-time review tracking

    // Username-based review mappings
    mapping(string => ReviewStructs.NonRegisteredUser) public nonRegisteredUsers; // username => user data
    mapping(string => uint256[]) public usernameReviews; // username => review IDs
    mapping(address => mapping(string => bool)) public hasReviewedUsername; // reviewer => username => bool

    // Unified entity review tracking (to prevent double reviews of same entity)
    mapping(address => mapping(bytes32 => bool)) public hasReviewedEntity; // reviewer => entityHash => bool

    // Badge system mappings
    mapping(address => mapping(uint256 => bool)) public hasBadge;
    mapping(uint256 => address[]) public badgeHolders; // for leaderboards

    // Login streak mappings
    mapping(address => UserStructs.LoginData) public loginData;

    // Admin mappings
    mapping(address => bool) public moderators;

    // ============ Events ============

    event UserRegistered(address indexed user, uint256 timestamp);
    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        address indexed reviewee,
        uint8 rating,
        string comment,
        uint256 timestamp
    );
    event BadgeClaimed(address indexed user, uint256 indexed badgeId, string badgeName, uint256 tokenId);
    event LoginStreakUpdated(address indexed user, uint256 currentStreak, uint256 longestStreak);
    event ReputationUpdated(address indexed user, uint256 oldScore, uint256 newScore, WaffleEnums.ReputationTier tier);
    event BadgeCreated(uint256 indexed badgeId, string name, uint256 requiredScore);
    event ReviewVerified(uint256 indexed reviewId, bool isVerified, address verifier);

    mapping(uint256 => string) private _tokenURIs;

    // ============ Modifiers ============

    modifier onlyRegistered() {
        if (!isRegistered[msg.sender]) revert WaffleErrors.UserNotRegistered();
        _;
    }

    modifier validAddress(address addr) {
        if (addr == address(0)) revert WaffleErrors.ZeroAddress();
        _;
    }

    modifier onlyModerator() {
        if (!moderators[msg.sender] && msg.sender != owner()) {
            revert WaffleErrors.OnlyAuthorized();
        }
        _;
    }

    // ============ Constructor ============

    constructor() ERC721("Waffle Badges", "WAFFLE") Ownable(msg.sender) {
        // Set deployer as first moderator
        moderators[msg.sender] = true;

        // Create default badges
        _createDefaultBadges();
    }

    // ============ User Management Functions ============

    function registerUser() external override whenNotPaused {
        if (isRegistered[msg.sender]) {
            revert WaffleErrors.UserAlreadyRegistered();
        }

        UserStructs.UserProfile storage profile = userProfiles[msg.sender];
        profile.reputationScore = ReputationLib.BASE_SCORE;
        profile.loginStreak = 1;
        profile.lastLoginDate = block.timestamp;

        // Initialize login data
        loginData[msg.sender] =
            UserStructs.LoginData({currentStreak: 1, longestStreak: 1, lastLoginDate: block.timestamp, totalLogins: 1});

        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender, block.timestamp);
        emit LoginStreakUpdated(msg.sender, 1, 1);
    }

    function registerUserWithTwitter(string calldata twitterUsername) external override whenNotPaused {
        if (isRegistered[msg.sender]) {
            revert WaffleErrors.UserAlreadyRegistered();
        }

        // Validate username
        if (!ValidationLib.validateUsername(twitterUsername)) {
            revert WaffleErrors.InvalidInput();
        }

        // Check if username is already linked to another address
        if (usernameToAddress[twitterUsername] != address(0)) {
            revert WaffleErrors.UsernameAlreadyLinked();
        }

        // Link the username to the address
        addressToUsername[msg.sender] = twitterUsername;
        usernameToAddress[twitterUsername] = msg.sender;

        // Register the user
        UserStructs.UserProfile storage profile = userProfiles[msg.sender];
        profile.reputationScore = ReputationLib.BASE_SCORE;
        profile.loginStreak = 1;
        profile.lastLoginDate = block.timestamp;

        // Initialize login data
        loginData[msg.sender] =
            UserStructs.LoginData({currentStreak: 1, longestStreak: 1, lastLoginDate: block.timestamp, totalLogins: 1});

        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender, block.timestamp);
        emit LoginStreakUpdated(msg.sender, 1, 1);
    }

    function updateLoginStreak() external override onlyRegistered whenNotPaused {
        UserStructs.LoginData storage loginInfo = loginData[msg.sender];
        UserStructs.UserProfile storage profile = userProfiles[msg.sender];

        (bool canUpdate, bool isDayMissed) = ValidationLib.validateLoginStreak(loginInfo.lastLoginDate);

        if (!canUpdate) revert WaffleErrors.AlreadyLoggedInToday();

        if (isDayMissed) {
            // Streak broken - reset to 1
            loginInfo.currentStreak = 1;
            profile.loginStreak = 1;
        } else {
            // Consecutive day - increment streak
            loginInfo.currentStreak += 1;
            profile.loginStreak = loginInfo.currentStreak;

            // Update longest streak
            if (loginInfo.currentStreak > loginInfo.longestStreak) {
                loginInfo.longestStreak = loginInfo.currentStreak;
            }
        }

        loginInfo.lastLoginDate = block.timestamp;
        loginInfo.totalLogins += 1;
        profile.lastLoginDate = block.timestamp;

        // Give streak bonuses
        if (loginInfo.currentStreak % 7 == 0) {
            // Weekly bonus
            uint256 oldScore = profile.reputationScore;
            profile.reputationScore += ReputationLib.STREAK_WEEKLY_BONUS;

            WaffleEnums.ReputationTier tier = ReputationLib.getReputationTier(profile.reputationScore);
            emit ReputationUpdated(msg.sender, oldScore, profile.reputationScore, tier);
        }

        emit LoginStreakUpdated(msg.sender, loginInfo.currentStreak, loginInfo.longestStreak);

        // Check for streak-based badge eligibility
        _checkStreakBadgeEligibility(msg.sender);
    }

    // ============ Review System Functions ============

    function submitReview(address reviewee, uint8 rating, string calldata comment)
        external
        override
        whenNotPaused
        validAddress(reviewee)
        nonReentrant
    {
        // Validate input
        if (!ValidationLib.validateReviewInput(msg.sender, reviewee, rating, comment)) {
            revert WaffleErrors.InvalidInput();
        }

        // Check if entity can be reviewed (unified logic)
        if (!_canReviewEntity(msg.sender, reviewee, "")) {
            revert WaffleErrors.EntityAlreadyReviewed();
        }

        // Sanitize comment
        string memory sanitizedComment = comment.sanitizeString();

        _reviewIds++;
        uint256 reviewId = _reviewIds;

        reviews[reviewId] = ReviewStructs.Review({
            id: reviewId,
            reviewer: msg.sender,
            reviewee: reviewee,
            revieweeUsername: "", // Empty for registered users
            rating: rating,
            comment: sanitizedComment,
            timestamp: block.timestamp,
            isVerified: false,
            isRegisteredReviewee: true
        });

        userReviews[reviewee].push(reviewId);
        reviewsGiven[msg.sender].push(reviewId);

        // Use unified entity tracking
        _markEntityReviewed(msg.sender, reviewee, "");

        // Maintain backward compatibility with old mapping
        hasReviewed[msg.sender][reviewee] = true;

        // Update reviewee's stats and reputation
        if (isRegistered[reviewee]) {
            _updateUserStats(reviewee, rating);
        }

        emit ReviewSubmitted(reviewId, msg.sender, reviewee, rating, sanitizedComment, block.timestamp);
    }

    function submitUsernameReview(string calldata username, uint8 rating, string calldata comment)
        external
        override
        whenNotPaused
        nonReentrant
    {
        // Validate input
        if (!ValidationLib.validateUsernameReviewInput(msg.sender, username, rating, comment)) {
            revert WaffleErrors.InvalidInput();
        }

        // Check if entity can be reviewed (unified logic)
        if (!_canReviewEntity(msg.sender, address(0), username)) {
            revert WaffleErrors.EntityAlreadyReviewed();
        }

        // Sanitize comment
        string memory sanitizedComment = comment.sanitizeString();

        _reviewIds++;
        uint256 reviewId = _reviewIds;

        reviews[reviewId] = ReviewStructs.Review({
            id: reviewId,
            reviewer: msg.sender,
            reviewee: address(0), // No address for non-registered users
            revieweeUsername: username,
            rating: rating,
            comment: sanitizedComment,
            timestamp: block.timestamp,
            isVerified: false,
            isRegisteredReviewee: false
        });

        usernameReviews[username].push(reviewId);
        reviewsGiven[msg.sender].push(reviewId);

        // Use unified entity tracking
        _markEntityReviewed(msg.sender, address(0), username);

        // Maintain backward compatibility with old mapping
        hasReviewedUsername[msg.sender][username] = true;

        // Update username stats
        _updateUsernameStats(username, rating);

        // If username is linked to a registered address, also update user stats
        address linkedAddress = usernameToAddress[username];
        if (linkedAddress != address(0) && isRegistered[linkedAddress]) {
            _updateUserStats(linkedAddress, rating);
        }

        emit ReviewSubmitted(reviewId, msg.sender, address(0), rating, sanitizedComment, block.timestamp);
    }

    function submitEntityReview(
        address revieweeAddress,
        string calldata revieweeUsername,
        uint8 rating,
        string calldata comment
    ) external override whenNotPaused nonReentrant {
        // Validate that exactly one of address or username is provided
        bool hasAddress = revieweeAddress != address(0);
        bool hasUsername = bytes(revieweeUsername).length > 0;

        if (hasAddress == hasUsername) {
            revert WaffleErrors.InvalidInput(); // Must provide exactly one
        }

        // Validate input based on type
        if (hasAddress) {
            if (!ValidationLib.validateReviewInput(msg.sender, revieweeAddress, rating, comment)) {
                revert WaffleErrors.InvalidInput();
            }
        } else {
            if (!ValidationLib.validateUsernameReviewInput(msg.sender, revieweeUsername, rating, comment)) {
                revert WaffleErrors.InvalidInput();
            }
        }

        // Check if entity can be reviewed (unified logic)
        if (!_canReviewEntity(msg.sender, revieweeAddress, revieweeUsername)) {
            revert WaffleErrors.EntityAlreadyReviewed();
        }

        // Sanitize comment
        string memory sanitizedComment = comment.sanitizeString();

        _reviewIds++;
        uint256 reviewId = _reviewIds;

        // Create review
        reviews[reviewId] = ReviewStructs.Review({
            id: reviewId,
            reviewer: msg.sender,
            reviewee: revieweeAddress,
            revieweeUsername: revieweeUsername,
            rating: rating,
            comment: sanitizedComment,
            timestamp: block.timestamp,
            isVerified: false,
            isRegisteredReviewee: hasAddress
        });

        // Add to appropriate review arrays
        if (hasAddress) {
            userReviews[revieweeAddress].push(reviewId);
        } else {
            usernameReviews[revieweeUsername].push(reviewId);
        }
        reviewsGiven[msg.sender].push(reviewId);

        // Mark entity as reviewed (unified tracking)
        _markEntityReviewed(msg.sender, revieweeAddress, revieweeUsername);

        // Maintain backward compatibility with old mappings
        if (hasAddress) {
            hasReviewed[msg.sender][revieweeAddress] = true;
        } else {
            hasReviewedUsername[msg.sender][revieweeUsername] = true;
        }

        // Update stats
        if (hasAddress) {
            _updateUserStats(revieweeAddress, rating);
        } else {
            _updateUsernameStats(revieweeUsername, rating);

            // If username is linked to a registered address, also update user stats
            address linkedAddress = usernameToAddress[revieweeUsername];
            if (linkedAddress != address(0) && isRegistered[linkedAddress]) {
                _updateUserStats(linkedAddress, rating);
            }
        }

        emit ReviewSubmitted(reviewId, msg.sender, revieweeAddress, rating, sanitizedComment, block.timestamp);
    }

    function verifyReview(uint256 reviewId, bool verified) external override onlyModerator whenNotPaused {
        if (reviewId > _reviewIds || reviewId == 0) {
            revert WaffleErrors.ReviewNotFound();
        }

        ReviewStructs.Review storage review = reviews[reviewId];
        if (review.isVerified == verified) {
            revert WaffleErrors.ReviewAlreadyVerified();
        }

        review.isVerified = verified;

        emit ReviewVerified(reviewId, verified, msg.sender);
    }

    // ============ Badge System Functions ============

    function claimBadge(uint256 badgeId) external override onlyRegistered whenNotPaused nonReentrant {
        if (badgeId > _badgeIds || badgeId == 0) {
            revert WaffleErrors.BadgeNotFound();
        }
        if (!badges[badgeId].isActive) revert WaffleErrors.BadgeNotActive();
        if (hasBadge[msg.sender][badgeId]) {
            revert WaffleErrors.BadgeAlreadyClaimed();
        }

        UserStructs.UserProfile storage profile = userProfiles[msg.sender];
        BadgeStructs.Badge memory badge = badges[badgeId];

        // Check eligibility
        if (!_checkBadgeEligibility(msg.sender, badgeId)) {
            revert WaffleErrors.NotEligibleForBadge();
        }

        // Mark as owned
        hasBadge[msg.sender][badgeId] = true;
        profile.ownedBadges.push(badgeId);
        badgeHolders[badgeId].push(msg.sender);

        // Mint soulbound NFT
        _tokenIds++;
        uint256 tokenId = _tokenIds;

        string memory json = string(
            abi.encodePacked(
                "{",
                '"name":"',
                badge.name,
                '",',
                '"description":"',
                badge.description,
                '",',
                '"image":"',
                badge.imageURI,
                '"',
                "}"
            )
        );

        string memory encodedTokenURI =
            string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, encodedTokenURI);

        // Add badge bonus to reputation
        uint256 oldScore = profile.reputationScore;
        profile.reputationScore += ReputationLib.BADGE_BONUS_MULTIPLIER;

        WaffleEnums.ReputationTier tier = ReputationLib.getReputationTier(profile.reputationScore);

        emit BadgeClaimed(msg.sender, badgeId, badge.name, tokenId);
        emit ReputationUpdated(msg.sender, oldScore, profile.reputationScore, tier);
    }

    function _setTokenURI(uint256 tokenId, string memory _uri) internal virtual {
        _tokenURIs[tokenId] = _uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function createBadge(
        string calldata name,
        string calldata description,
        string calldata imageURI,
        uint256 requiredScore
    ) external override onlyOwner {
        if (!ValidationLib.validateBadgeInput(name, description, requiredScore)) {
            revert WaffleErrors.InvalidBadgeRequirements();
        }

        _badgeIds++;
        uint256 badgeId = _badgeIds;

        badges[badgeId] = BadgeStructs.Badge({
            id: badgeId,
            name: name,
            description: description,
            imageURI: imageURI,
            requiredScore: requiredScore,
            isActive: true
        });

        emit BadgeCreated(badgeId, name, requiredScore);
    }

    function toggleBadge(uint256 badgeId) external override onlyModerator {
        if (badgeId > _badgeIds || badgeId == 0) {
            revert WaffleErrors.BadgeNotFound();
        }
        badges[badgeId].isActive = !badges[badgeId].isActive;
    }

    // ============ View Functions ============

    function getUserProfile(address user) external view override returns (UserStructs.UserProfile memory) {
        return userProfiles[user];
    }

    function getUserReviews(address user) external view override returns (uint256[] memory) {
        return userReviews[user];
    }

    function getReviewsGiven(address user) external view override returns (uint256[] memory) {
        return reviewsGiven[user];
    }

    function getReview(uint256 reviewId) external view override returns (ReviewStructs.Review memory) {
        return reviews[reviewId];
    }

    function getBadge(uint256 badgeId) external view override returns (BadgeStructs.Badge memory) {
        return badges[badgeId];
    }

    function getUserBadges(address user) external view override returns (uint256[] memory) {
        return userProfiles[user].ownedBadges;
    }

    function getTotalReviews() external view override returns (uint256) {
        return _reviewIds;
    }

    function getUsernameReviews(string calldata username) external view override returns (uint256[] memory) {
        return usernameReviews[username];
    }

    function getNonRegisteredUser(string calldata username)
        external
        view
        override
        returns (ReviewStructs.NonRegisteredUser memory)
    {
        return nonRegisteredUsers[username];
    }

    function getTotalBadges() external view override returns (uint256) {
        return _badgeIds;
    }

    function getLoginStreak(address user) external view override returns (uint256) {
        return loginData[user].currentStreak;
    }

    function getReputationTier(address user) external view returns (WaffleEnums.ReputationTier) {
        return ReputationLib.getReputationTier(userProfiles[user].reputationScore);
    }

    // ============ Internal Functions ============

    function _updateUserStats(address user, uint8 rating) internal {
        UserStructs.UserProfile storage profile = userProfiles[user];
        uint256 oldScore = profile.reputationScore;

        profile.totalReviews++;

        if (rating == 3) {
            // Positive review
            profile.positiveReviews++;
            profile.reputationScore += ReputationLib.POSITIVE_REVIEW_POINTS;
        } else if (rating == 2) {
            // Neutral review
            profile.neutralReviews++;
            profile.reputationScore += ReputationLib.NEUTRAL_REVIEW_POINTS;
        } else {
            // Negative review (rating == 1)
            profile.negativeReviews++;
            // Allow going below base score if many negative reviews
            if (profile.reputationScore >= ReputationLib.NEGATIVE_REVIEW_POINTS) {
                profile.reputationScore -= ReputationLib.NEGATIVE_REVIEW_POINTS;
            } else {
                profile.reputationScore = 0; // Minimum possible score
            }
        }

        WaffleEnums.ReputationTier tier = ReputationLib.getReputationTier(profile.reputationScore);
        emit ReputationUpdated(user, oldScore, profile.reputationScore, tier);

        // Check for review-based badge eligibility
        _checkReviewBadgeEligibility(user);
    }

    function _updateUsernameStats(string memory username, uint8 rating) internal {
        ReviewStructs.NonRegisteredUser storage userData = nonRegisteredUsers[username];

        // Initialize if first review
        if (!userData.exists) {
            userData.username = username;
            userData.exists = true;
        }

        userData.totalReviews++;

        if (rating == 3) {
            userData.positiveReviews++;
        } else if (rating == 2) {
            userData.neutralReviews++;
        } else {
            userData.negativeReviews++;
        }

        // Calculate average rating (multiply by 100 for precision)
        if (userData.totalReviews > 0) {
            uint256 totalRatingPoints =
                (userData.positiveReviews * 3) + (userData.neutralReviews * 2) + (userData.negativeReviews * 1);
            userData.averageRating = (totalRatingPoints * 100) / userData.totalReviews;
        }
    }

    function _checkBadgeEligibility(address user, uint256 badgeId) public view returns (bool) {
        UserStructs.UserProfile memory profile = userProfiles[user];
        BadgeStructs.Badge memory badge = badges[badgeId];

        // Basic eligibility: reputation score
        // Badge 4 - Builder shud met the requiredScore
        if (profile.reputationScore < badge.requiredScore) return false;

        // Specific badge requirements
        if (badgeId == 2) {
            return profile.totalReviews >= 10;
        } else if (badgeId == 3) {
            return profile.totalReviews >= 10 && profile.positiveReviews >= 7;
        }

        // Early Adopter always get the badge
        return true;
    }

    function _checkReviewBadgeEligibility(address user) internal view {
        // Check for Early Adopter badge
        if (!hasBadge[user][1] && _checkBadgeEligibility(user, 1)) {
            // TBA
        }

        // Check for Trusted Reviewer badge
        if (!hasBadge[user][2] && _checkBadgeEligibility(user, 2)) {
            // TBA
        }
    }

    function _checkStreakBadgeEligibility(address user) internal view {
        // Check for Streak Master badge
        if (!hasBadge[user][3] && _checkBadgeEligibility(user, 3)) {
            // TBA
        }
    }

    function _createDefaultBadges() internal {
        // Early Adopter Badge
        _badgeIds++;
        badges[1] = BadgeStructs.Badge({
            id: 1,
            name: "Early Adopter",
            description: "One of the first to join Waffle community",
            imageURI: "https://ik.imagekit.io/3592mo0vh/waffle/early_adopter",
            requiredScore: 100,
            isActive: true
        });

        // Trusted Reviewer Badge
        _badgeIds++;
        badges[2] = BadgeStructs.Badge({
            id: 2,
            name: "Supportive Soul",
            description: "Awarded to those who uplift and encourage others in the community.",
            imageURI: "https://ik.imagekit.io/3592mo0vh/waffle/support.svg",
            requiredScore: 500,
            isActive: true
        });

        // Streak Master Badge
        _badgeIds++;
        badges[3] = BadgeStructs.Badge({
            id: 3,
            name: "Contributor",
            description: "Given to members who actively contribute ideas, feedback, or resources.",
            imageURI: "https://ik.imagekit.io/3592mo0vh/waffle/contrib.svg",
            requiredScore: 300,
            isActive: true
        });

        // Golden Waffle Badge
        _badgeIds++;
        badges[4] = BadgeStructs.Badge({
            id: 4,
            name: "Builder",
            description: "Recognizes individuals who create and innovate through hands-on work.",
            imageURI: "https://ik.imagekit.io/3592mo0vh/waffle/build.svg",
            requiredScore: 2000,
            isActive: true
        });

        // // Community Builder Badge
        // _badgeIds++;
        // badges[5] = BadgeStructs.Badge({
        //     id: 5,
        //     name: "Community Builder",
        //     description: "Received 50+ reviews from community",
        //     imageURI: "ipfs://QmCommunityBuilder",
        //     requiredScore: 750,
        //     isActive: true
        // });
    }

    // ============ Admin Functions ============

    function setModerator(address user, bool isModerator) external onlyOwner {
        moderators[user] = isModerator;
    }

    function setInvitationAuthority(address user, bool hasAuthority) external override onlyOwner {
        userProfiles[user].hasInvitationAuthority = hasAuthority;
    }

    function getLinkedAddress(string calldata username) external view override returns (address) {
        return usernameToAddress[username];
    }

    function getLinkedUsername(address user) external view override returns (string memory) {
        return addressToUsername[user];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ Soulbound Token Overrides ============

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert WaffleErrors.SoulboundTokenTransferNotAllowed();
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert WaffleErrors.SoulboundTokenApprovalNotAllowed();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert WaffleErrors.SoulboundTokenApprovalNotAllowed();
    }

    function getApproved(uint256) public pure override returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address) public pure override returns (bool) {
        return false;
    }

    function hasUserReviewed(address reviewer, address reviewee) external view returns (bool) {
        return hasReviewed[reviewer][reviewee];
    }

    function hasUserReviewedUsername(address reviewer, string calldata username) external view returns (bool) {
        return hasReviewedUsername[reviewer][username];
    }

    function hasReviewedEntityByHash(address reviewer, address entityAddress, string calldata entityUsername)
        external
        view
        returns (bool)
    {
        bytes32 entityHash = _getEntityHash(entityAddress, entityUsername);
        return hasReviewedEntity[reviewer][entityHash];
    }

    function canReviewEntity(address reviewer, address entityAddress, string calldata entityUsername)
        external
        view
        returns (bool)
    {
        return _canReviewEntity(reviewer, entityAddress, entityUsername);
    }

    // ============ Internal Helper Functions ============

    function _getEntityHash(address entityAddress, string memory entityUsername) internal pure returns (bytes32) {
        // Create a unique hash for the entity (address or username)
        if (entityAddress != address(0)) {
            return keccak256(abi.encodePacked("address:", entityAddress));
        } else {
            return keccak256(abi.encodePacked("username:", entityUsername));
        }
    }

    function _canReviewEntity(address reviewer, address entityAddress, string memory entityUsername)
        internal
        view
        returns (bool)
    {
        // Check if reviewer has already reviewed this entity
        bytes32 entityHash = _getEntityHash(entityAddress, entityUsername);
        if (hasReviewedEntity[reviewer][entityHash]) {
            return false;
        }

        // If reviewing by address, also check if they've reviewed the linked username
        if (entityAddress != address(0)) {
            string memory linkedUsername = addressToUsername[entityAddress];
            if (bytes(linkedUsername).length > 0) {
                bytes32 usernameHash = _getEntityHash(address(0), linkedUsername);
                if (hasReviewedEntity[reviewer][usernameHash]) {
                    return false;
                }
            }
        }

        // If reviewing by username, also check if they've reviewed the linked address
        if (bytes(entityUsername).length > 0) {
            address linkedAddress = usernameToAddress[entityUsername];
            if (linkedAddress != address(0)) {
                bytes32 addressHash = _getEntityHash(linkedAddress, "");
                if (hasReviewedEntity[reviewer][addressHash]) {
                    return false;
                }
            }
        }

        return true;
    }

    function _markEntityReviewed(address reviewer, address entityAddress, string memory entityUsername) internal {
        // Mark the primary entity as reviewed
        bytes32 entityHash = _getEntityHash(entityAddress, entityUsername);
        hasReviewedEntity[reviewer][entityHash] = true;

        // If reviewing by address, also mark the linked username as reviewed
        if (entityAddress != address(0)) {
            string memory linkedUsername = addressToUsername[entityAddress];
            if (bytes(linkedUsername).length > 0) {
                bytes32 usernameHash = _getEntityHash(address(0), linkedUsername);
                hasReviewedEntity[reviewer][usernameHash] = true;
            }
        }

        // If reviewing by username, also mark the linked address as reviewed
        if (bytes(entityUsername).length > 0) {
            address linkedAddress = usernameToAddress[entityUsername];
            if (linkedAddress != address(0)) {
                bytes32 addressHash = _getEntityHash(linkedAddress, "");
                hasReviewedEntity[reviewer][addressHash] = true;
            }
        }
    }
}
