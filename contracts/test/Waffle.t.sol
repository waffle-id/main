// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Waffle.sol";
import "../src/structs/UserStructs.sol";
import "../src/structs/ReviewStructs.sol";
import "../src/structs/BadgeStructs.sol";
import "../src/enums/WaffleEnums.sol";
import "../src/errors/WaffleErrors.sol";

contract WaffleTest is Test {
    Waffle public waffle;

    // Test accounts
    address public alice;
    address public bob;
    address public charlie;
    address public dave;
    address public eve;

    // Events for testing
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

    function setUp() public {
        // Deploy Waffle contract
        waffle = new Waffle();

        // Create test accounts
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        dave = makeAddr("dave");
        eve = makeAddr("eve");

        // Fund accounts with ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
        vm.deal(dave, 10 ether);
        vm.deal(eve, 10 ether);
    }

    // ============ User Registration Tests ============

    function testCannotRegisterTwice() public {
        // Register once
        vm.prank(alice);
        waffle.registerUser();

        // Try to register again - should fail
        vm.expectRevert(WaffleErrors.UserAlreadyRegistered.selector);
        vm.prank(alice);
        waffle.registerUser();
    }

    function testMultipleUsersRegistration() public {
        address[] memory users = new address[](3);
        users[0] = alice;
        users[1] = bob;
        users[2] = charlie;

        for (uint256 i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            waffle.registerUser();
            assertTrue(waffle.isRegistered(users[i]));
        }
    }

    // ============ Review System Tests ============

    function testSubmitReview() public {
        // Register users
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Alice reviews Bob positively
        vm.expectEmit(true, true, true, true);
        emit ReviewSubmitted(1, alice, bob, 3, "Great person to work with!", block.timestamp);

        vm.prank(alice);
        waffle.submitReview(bob, 3, "Great person to work with!");

        // Verify review was created
        ReviewStructs.Review memory review = waffle.getReview(1);
        assertEq(review.id, 1);
        assertEq(review.reviewer, alice);
        assertEq(review.reviewee, bob);
        assertEq(review.rating, 3);
        assertEq(review.comment, "Great person to work with!");
        assertFalse(review.isVerified);

        // Verify total reviews count
        assertEq(waffle.getTotalReviews(), 1);
    }

    function testCannotReviewSelf() public {
        vm.prank(alice);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        vm.prank(alice);
        waffle.submitReview(alice, 3, "Reviewing myself");
    }

    function testCannotReviewUnregisteredUser() public {
        vm.prank(alice);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.UserNotRegistered.selector);
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Bob is not registered");
    }

    function testCannotReviewWithInvalidRating() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Test rating 0 (below minimum)
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        vm.prank(alice);
        waffle.submitReview(bob, 0, "Invalid rating");

        // Test rating 4 (above maximum)
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        vm.prank(alice);
        waffle.submitReview(bob, 4, "Invalid rating");
    }

    function testCannotReviewWithEmptyComment() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        vm.prank(alice);
        waffle.submitReview(bob, 3, "");
    }

    function testCannotReviewSameUserTwice() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // First review should succeed
        vm.prank(alice);
        waffle.submitReview(bob, 3, "First review");

        // Second review should fail
        vm.expectRevert(WaffleErrors.UserAlreadyReviewed.selector);
        vm.prank(alice);
        waffle.submitReview(bob, 2, "Second review");
    }

    function testBidirectionalReviews() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Alice reviews Bob
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Alice reviews Bob");

        // Bob can still review Alice (different direction)
        vm.prank(bob);
        waffle.submitReview(alice, 2, "Bob reviews Alice");

        // Verify both reviews exist
        assertTrue(waffle.hasUserReviewed(alice, bob));
        assertTrue(waffle.hasUserReviewed(bob, alice));

        assertEq(waffle.getTotalReviews(), 2);
    }

    function testReviewUpdatesReputation() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        uint256 initialScore = waffle.getUserProfile(bob).reputationScore;

        // Positive review should increase reputation
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Positive review");

        uint256 newScore = waffle.getUserProfile(bob).reputationScore;
        assertGt(newScore, initialScore);
    }

    function testReviewTypesUpdateStats() public {
        // Register multiple users
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();
        vm.prank(charlie);
        waffle.registerUser();
        vm.prank(dave);
        waffle.registerUser();

        // Different rating types for Alice
        vm.prank(bob);
        waffle.submitReview(alice, 3, "Positive"); // Positive

        vm.prank(charlie);
        waffle.submitReview(alice, 2, "Neutral"); // Neutral

        vm.prank(dave);
        waffle.submitReview(alice, 1, "Negative"); // Negative

        UserStructs.UserProfile memory profile = waffle.getUserProfile(alice);
        assertEq(profile.totalReviews, 3);
        assertEq(profile.positiveReviews, 1);
        assertEq(profile.neutralReviews, 1);
        assertEq(profile.negativeReviews, 1);
    }

    // ============ Login Streak Tests ============

    function testLoginStreakInitialization() public {
        vm.prank(alice);
        waffle.registerUser();

        assertEq(waffle.getLoginStreak(alice), 1);
    }

    function testConsecutiveLoginStreak() public {
        vm.prank(alice);
        waffle.registerUser();

        // Simulate next day login
        vm.warp(block.timestamp + 1 days);

        vm.expectEmit(true, false, false, true);
        emit LoginStreakUpdated(alice, 2, 2);

        vm.prank(alice);
        waffle.updateLoginStreak();

        assertEq(waffle.getLoginStreak(alice), 2);
    }

    function testBrokenLoginStreak() public {
        vm.prank(alice);
        waffle.registerUser();

        // Skip 2 days
        vm.warp(block.timestamp + 2 days);

        vm.prank(alice);
        waffle.updateLoginStreak();

        // Streak should reset to 1
        assertEq(waffle.getLoginStreak(alice), 1);
    }

    function testCannotUpdateStreakSameDay() public {
        vm.prank(alice);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.AlreadyLoggedInToday.selector);
        vm.prank(alice);
        waffle.updateLoginStreak();
    }

    function testWeeklyStreakBonus() public {
        vm.prank(alice);
        waffle.registerUser();

        uint256 initialScore = waffle.getUserProfile(alice).reputationScore;

        // Simulate 7 days of consecutive logins
        for (uint256 i = 1; i < 7; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(alice);
            waffle.updateLoginStreak();
        }

        uint256 finalScore = waffle.getUserProfile(alice).reputationScore;
        assertGt(finalScore, initialScore); // Should have weekly bonus
    }

    // ============ Badge System Tests ============

    function testEarlyAdopterBadge() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Give Alice a review to meet requirement
        vm.prank(bob);
        waffle.submitReview(alice, 3, "Good person");

        // Alice should be able to claim Early Adopter badge
        vm.expectEmit(true, true, false, true);
        emit BadgeClaimed(alice, 1, "Early Adopter", 1);

        vm.prank(alice);
        waffle.claimBadge(1);

        // Verify badge ownership
        assertTrue(waffle.hasBadge(alice, 1));

        uint256[] memory aliceBadges = waffle.getUserBadges(alice);
        assertEq(aliceBadges.length, 1);
        assertEq(aliceBadges[0], 1);
    }

    function testCannotClaimBadgeWithoutEligibility() public {
        vm.prank(alice);
        waffle.registerUser();

        // Try to claim Early Adopter without any reviews
        vm.expectRevert(WaffleErrors.NotEligibleForBadge.selector);
        vm.prank(alice);
        waffle.claimBadge(1);
    }

    function testCannotClaimBadgeTwice() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Give Alice a review and claim badge
        vm.prank(bob);
        waffle.submitReview(alice, 3, "Good person");

        vm.prank(alice);
        waffle.claimBadge(1);

        // Try to claim again
        vm.expectRevert(WaffleErrors.BadgeAlreadyClaimed.selector);
        vm.prank(alice);
        waffle.claimBadge(1);
    }

    function testTrustedReviewerBadge() public {
        // Register users
        address[] memory reviewers = new address[](10);
        for (uint256 i = 0; i < 10; i++) {
            reviewers[i] = makeAddr(string(abi.encodePacked("reviewer", i)));
            vm.prank(reviewers[i]);
            waffle.registerUser();
        }

        vm.prank(alice);
        waffle.registerUser();

        // Give Alice 10 reviews, 7 positive
        for (uint256 i = 0; i < 7; i++) {
            vm.prank(reviewers[i]);
            waffle.submitReview(alice, 3, "Positive review");
        }
        for (uint256 i = 7; i < 10; i++) {
            vm.prank(reviewers[i]);
            waffle.submitReview(alice, 2, "Neutral review");
        }

        // Alice should be able to claim Trusted Reviewer badge
        vm.prank(alice);
        waffle.claimBadge(2);

        assertTrue(waffle.hasBadge(alice, 2));
    }

    function testStreakMasterBadge() public {
        vm.prank(alice);
        waffle.registerUser();

        // Simulate 30 days of consecutive logins
        for (uint256 i = 1; i < 30; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(alice);
            waffle.updateLoginStreak();
        }

        // Alice should be able to claim Streak Master badge
        vm.prank(alice);
        waffle.claimBadge(3);

        assertTrue(waffle.hasBadge(alice, 3));
    }

    function testNonExistentBadge() public {
        vm.prank(alice);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.BadgeNotFound.selector);
        vm.prank(alice);
        waffle.claimBadge(999);
    }

    // ============ Admin Functions Tests ============

    function testSetModerator() public {
        waffle.setModerator(alice, true);

        // Alice should be able to toggle badges
        vm.prank(alice);
        waffle.toggleBadge(1);

        BadgeStructs.Badge memory badge = waffle.getBadge(1);
        assertFalse(badge.isActive);
    }

    function testOnlyOwnerCanSetModerator() public {
        vm.expectRevert();
        vm.prank(alice);
        waffle.setModerator(bob, true);
    }

    function testOnlyModeratorCanToggleBadge() public {
        vm.expectRevert(WaffleErrors.OnlyAuthorized.selector);
        vm.prank(alice);
        waffle.toggleBadge(1);
    }

    function testOnlyAIVerifierCanVerifyReview() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        vm.prank(alice);
        waffle.submitReview(bob, 3, "Test review");

        vm.expectRevert(WaffleErrors.OnlyAuthorized.selector);
        vm.prank(charlie);
        waffle.verifyReview(1, true);
    }

    // ============ Edge Cases & Security Tests ============

    function testCannotReviewWhenPaused() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Pause the contract
        waffle.pause();

        vm.expectRevert();
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Should fail when paused");
    }

    function testCannotClaimBadgeWhenPaused() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        vm.prank(bob);
        waffle.submitReview(alice, 3, "Good person");

        waffle.pause();

        vm.expectRevert();
        vm.prank(alice);
        waffle.claimBadge(1);
    }

    function testSoulboundTokensCannotBeTransferred() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();
        vm.prank(charlie);
        waffle.registerUser();

        // Alice gets a review and claims badge
        vm.prank(bob);
        waffle.submitReview(alice, 3, "Good person");

        vm.prank(alice);
        waffle.claimBadge(1);

        // Try to transfer the NFT
        vm.expectRevert(WaffleErrors.SoulboundTokenTransferNotAllowed.selector);
        vm.prank(alice);
        waffle.transferFrom(alice, charlie, 1);
    }

    function testSoulboundTokensCannotBeApproved() public {
        vm.expectRevert(WaffleErrors.SoulboundTokenApprovalNotAllowed.selector);
        vm.prank(alice);
        waffle.approve(bob, 1);
    }

    function testZeroAddressValidation() public {
        vm.prank(alice);
        waffle.registerUser();

        vm.expectRevert(WaffleErrors.ZeroAddress.selector);
        vm.prank(alice);
        waffle.submitReview(address(0), 3, "Invalid address");
    }

    // ============ View Functions Tests ============

    function testGetUserProfileForUnregisteredUser() public view {
        UserStructs.UserProfile memory profile = waffle.getUserProfile(alice);
        assertEq(profile.reputationScore, 0);
        assertEq(profile.totalReviews, 0);
    }

    function testGetUserReviewsEmptyArray() public view {
        uint256[] memory reviews = waffle.getUserReviews(alice);
        assertEq(reviews.length, 0);
    }

    function testGetTotalBadges() public view {
        assertEq(waffle.getTotalBadges(), 5); // 5 default badges
    }

    function testHasUserReviewedFunction() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        assertFalse(waffle.hasUserReviewed(alice, bob));

        vm.prank(alice);
        waffle.submitReview(bob, 3, "Test review");

        assertTrue(waffle.hasUserReviewed(alice, bob));
        assertFalse(waffle.hasUserReviewed(bob, alice)); // Different direction
    }

    // ============ Integration Tests ============

    function testCompleteUserJourney() public {
        // 1. Registration
        vm.prank(alice);
        waffle.registerUser();

        // 2. Multiple users register and review Alice
        address[] memory reviewers = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            reviewers[i] = makeAddr(string(abi.encodePacked("user", i)));
            vm.prank(reviewers[i]);
            waffle.registerUser();

            vm.prank(reviewers[i]);
            waffle.submitReview(alice, 3, "Alice is great!");
        }

        // 3. Alice claims Early Adopter badge
        vm.prank(alice);
        waffle.claimBadge(1);

        // 4. Build login streak
        for (uint256 i = 1; i <= 7; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(alice);
            waffle.updateLoginStreak();
        }

        // 5. Verify final state
        UserStructs.UserProfile memory profile = waffle.getUserProfile(alice);
        assertEq(profile.totalReviews, 5);
        assertEq(profile.positiveReviews, 5);
        assertEq(profile.loginStreak, 8); // Initial + 7 updates
        assertTrue(waffle.hasBadge(alice, 1));
        assertGt(profile.reputationScore, 100); // Should have bonuses
    }

    // ============ Username Review Tests ============

    function testSubmitUsernameReview() public {
        // Register alice
        vm.prank(alice);
        waffle.registerUser();

        // Alice reviews a non-registered user by username
        vm.prank(alice);
        waffle.submitUsernameReview("testuser123", 3, "Great content creator!");

        // Check review was created
        uint256 totalReviews = waffle.getTotalReviews();
        assertEq(totalReviews, 1);

        // Get the review
        ReviewStructs.Review memory review = waffle.getReview(1);
        assertEq(review.reviewer, alice);
        assertEq(review.reviewee, address(0)); // No address for non-registered
        assertEq(review.revieweeUsername, "testuser123");
        assertEq(review.rating, 3);
        assertEq(review.comment, "Great content creator!");
        assertFalse(review.isRegisteredReviewee);

        // Check username stats
        ReviewStructs.NonRegisteredUser memory userData = waffle.getNonRegisteredUser("testuser123");
        assertEq(userData.username, "testuser123");
        assertEq(userData.totalReviews, 1);
        assertEq(userData.positiveReviews, 1);
        assertEq(userData.neutralReviews, 0);
        assertEq(userData.negativeReviews, 0);
        assertEq(userData.averageRating, 300); // 3.00 * 100
        assertTrue(userData.exists);

        // Check username reviews array
        uint256[] memory usernameReviews = waffle.getUsernameReviews("testuser123");
        assertEq(usernameReviews.length, 1);
        assertEq(usernameReviews[0], 1);
    }

    function testSubmitMultipleUsernameReviews() public {
        // Register users
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Both review the same username
        vm.prank(alice);
        waffle.submitUsernameReview("influencer", 3, "Amazing content!");

        vm.prank(bob);
        waffle.submitUsernameReview("influencer", 2, "Good but could improve");

        // Check stats
        ReviewStructs.NonRegisteredUser memory userData = waffle.getNonRegisteredUser("influencer");
        assertEq(userData.totalReviews, 2);
        assertEq(userData.positiveReviews, 1);
        assertEq(userData.neutralReviews, 1);
        assertEq(userData.negativeReviews, 0);
        assertEq(userData.averageRating, 250); // (3+2)/2 = 2.5 * 100

        // Check review array
        uint256[] memory reviews = waffle.getUsernameReviews("influencer");
        assertEq(reviews.length, 2);
    }

    function testCannotReviewUsernameMultipleTimes() public {
        vm.prank(alice);
        waffle.registerUser();

        // First review should succeed
        vm.prank(alice);
        waffle.submitUsernameReview("creator", 3, "Great work!");

        // Second review should fail
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.UsernameAlreadyReviewed.selector);
        waffle.submitUsernameReview("creator", 2, "Changed my mind");
    }

    function testUsernameReviewValidation() public {
        vm.prank(alice);
        waffle.registerUser();

        // Test invalid username (too long)
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        waffle.submitUsernameReview("verylongusernamethatexceedslimit", 3, "comment");

        // Test invalid username (special characters)
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        waffle.submitUsernameReview("user@name", 3, "comment");

        // Test invalid rating
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        waffle.submitUsernameReview("validuser", 4, "comment");

        // Test empty comment
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.InvalidInput.selector);
        waffle.submitUsernameReview("validuser", 3, "");
    }

    function testUnregisteredUserCannotSubmitUsernameReview() public {
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.UserNotRegistered.selector);
        waffle.submitUsernameReview("someone", 3, "comment");
    }

    function testHasUserReviewedUsername() public {
        vm.prank(alice);
        waffle.registerUser();

        // Initially should be false
        assertFalse(waffle.hasUserReviewedUsername(alice, "testuser"));

        // After review should be true
        vm.prank(alice);
        waffle.submitUsernameReview("testuser", 3, "good");
        assertTrue(waffle.hasUserReviewedUsername(alice, "testuser"));

        // Different user should still be false
        assertFalse(waffle.hasUserReviewedUsername(bob, "testuser"));
    }

    function testUsernameReviewStats() public {
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();
        vm.prank(charlie);
        waffle.registerUser();

        // Submit various ratings
        vm.prank(alice);
        waffle.submitUsernameReview("creator", 3, "Positive");

        vm.prank(bob);
        waffle.submitUsernameReview("creator", 1, "Negative");

        vm.prank(charlie);
        waffle.submitUsernameReview("creator", 2, "Neutral");

        // Check final stats
        ReviewStructs.NonRegisteredUser memory userData = waffle.getNonRegisteredUser("creator");
        assertEq(userData.totalReviews, 3);
        assertEq(userData.positiveReviews, 1);
        assertEq(userData.neutralReviews, 1);
        assertEq(userData.negativeReviews, 1);
        assertEq(userData.averageRating, 200); // (3+1+2)/3 = 2.0 * 100
    }

    function testValidUsernameFormats() public {
        vm.prank(alice);
        waffle.registerUser();

        // Test valid usernames
        vm.prank(alice);
        waffle.submitUsernameReview("user123", 3, "valid");

        vm.prank(alice);
        waffle.submitUsernameReview("User_Name", 3, "valid");

        vm.prank(alice);
        waffle.submitUsernameReview("ABC", 3, "valid");

        vm.prank(alice);
        waffle.submitUsernameReview("a", 3, "valid"); // minimum length

        // Check all were created
        assertEq(waffle.getTotalReviews(), 4);
    }

    function testMixedRegisteredAndUsernameReviews() public {
        // Register users
        vm.prank(alice);
        waffle.registerUser();
        vm.prank(bob);
        waffle.registerUser();

        // Alice reviews Bob (registered)
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Good registered user");

        // Alice reviews a username (non-registered)
        vm.prank(alice);
        waffle.submitUsernameReview("twitteruser", 2, "Good content creator");

        // Bob reviews the same username
        vm.prank(bob);
        waffle.submitUsernameReview("twitteruser", 3, "Amazing creator");

        // Check stats
        assertEq(waffle.getTotalReviews(), 3);

        // Check Alice can't review Bob again
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.UserAlreadyReviewed.selector);
        waffle.submitReview(bob, 2, "Another review");

        // Check Alice can't review the username again
        vm.prank(alice);
        vm.expectRevert(WaffleErrors.UsernameAlreadyReviewed.selector);
        waffle.submitUsernameReview("twitteruser", 1, "Changed mind");

        // But Alice can review a different username
        vm.prank(alice);
        waffle.submitUsernameReview("anotheruser", 3, "Different user");

        assertEq(waffle.getTotalReviews(), 4);
    }
}
