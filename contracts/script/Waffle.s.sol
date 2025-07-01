// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/Waffle.sol";
import "../src/structs/UserStructs.sol";
import "../src/structs/BadgeStructs.sol";

/**
 * @title WaffleDeployment
 * @dev Enhanced deployment script for Waffle reputation protocol
 * @notice Supports mainnet, testnet, and development deployments with comprehensive setup
 */
contract WaffleDeployment is Script {
    Waffle public waffle;

    // Deployment configuration
    struct DeploymentConfig {
        bool setupModerators;
        bool registerDeployer;
        bool runDemo;
        bool verbose;
    }

    function run() external {
        DeploymentConfig memory config =
            DeploymentConfig({setupModerators: true, registerDeployer: false, runDemo: false, verbose: true});

        _deploy(config);
    }

    function deployMainnet() external {
        DeploymentConfig memory config =
            DeploymentConfig({setupModerators: true, registerDeployer: false, runDemo: false, verbose: true});

        console.log("=== MAINNET DEPLOYMENT ===");
        _deploy(config);
    }

    function deployTestnet() external {
        DeploymentConfig memory config =
            DeploymentConfig({setupModerators: true, registerDeployer: true, runDemo: true, verbose: true});

        console.log("=== TESTNET DEPLOYMENT ===");
        _deploy(config);
    }

    function deployDev() external {
        DeploymentConfig memory config =
            DeploymentConfig({setupModerators: false, registerDeployer: true, runDemo: true, verbose: true});

        console.log("=== DEVELOPMENT DEPLOYMENT ===");
        _deploy(config);
    }

    function deployDevWithUnifiedDemo() external {
        DeploymentConfig memory config =
            DeploymentConfig({setupModerators: false, registerDeployer: true, runDemo: true, verbose: true});

        console.log("=== DEVELOPMENT DEPLOYMENT WITH UNIFIED ENTITY REVIEW DEMO ===");
        _deploy(config);
        _runUnifiedEntityDemo();
    }

    function _deploy(DeploymentConfig memory config) internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        if (config.verbose) {
            console.log("Deploying from:", deployer);
            console.log("Deployer balance:", deployer.balance);
            console.log("Chain ID:", block.chainid);
            console.log("Block number:", block.number);
        }

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Waffle contract
        waffle = new Waffle();

        if (config.verbose) {
            console.log("Waffle contract deployed at:", address(waffle));
            console.log("Contract owner:", waffle.owner());
            console.log("Total default badges created:", waffle.getTotalBadges());
        }

        // Setup moderators
        if (config.setupModerators) {
            _setupModerators();
        }

        // Register deployer for testing
        if (config.registerDeployer) {
            waffle.registerUser();
            if (config.verbose) {
                console.log("Deployer registered as first user");
            }
        }

        vm.stopBroadcast();

        // Run demonstration
        if (config.runDemo) {
            _runDemo();
        }

        // Display deployment summary
        if (config.verbose) {
            _displayDeploymentSummary();
        }
    }

    function _setupModerators() internal {
        try vm.envAddress("MODERATOR_ADDRESS") returns (address moderator) {
            if (moderator != address(0)) {
                waffle.setModerator(moderator, true);
                console.log("Moderator set:", moderator);
            }
        } catch {
            console.log("No MODERATOR_ADDRESS provided");
        }
    }

    function _runDemo() internal {
        console.log("\n=== Running Waffle Demo ===");

        // Create test addresses
        address alice = makeAddr("alice");
        address bob = makeAddr("bob");
        address charlie = makeAddr("charlie");

        // Fund test accounts
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);
        vm.deal(charlie, 1 ether);

        // Register users
        vm.prank(alice);
        waffle.registerUser();
        console.log("Alice registered");

        vm.prank(bob);
        waffle.registerUser();
        console.log("Bob registered");

        vm.prank(charlie);
        waffle.registerUser();
        console.log("Charlie registered");

        // Demonstrate one-time review system
        _demonstrateOneTimeReviews(alice, bob, charlie);

        // Demonstrate username reviews
        _demonstrateUsernameReviews(alice, bob, charlie);

        // Demonstrate login streaks
        _demonstrateLoginStreaks(alice, bob);

        // Demonstrate badge system
        _demonstrateBadgeSystem(alice, bob);
    }

    function _runUnifiedEntityDemo() internal {
        console.log("\n=== UNIFIED ENTITY REVIEW SYSTEM DEMO ===");

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");
        address charlie = makeAddr("charlie");
        address unregistered = makeAddr("unregistered");

        // Demo 1: Register user with Twitter username
        console.log("\n--- User Registration with Twitter Linking ---");
        vm.prank(alice);
        waffle.registerUserWithTwitter("alice_crypto");
        console.log("Alice registered with Twitter username: alice_crypto");
        console.log("Linked address:", waffle.getLinkedAddress("alice_crypto"));
        console.log("Linked username:", waffle.getLinkedUsername(alice));

        // Demo 2: Register bob normally
        vm.prank(bob);
        waffle.registerUser();
        console.log("Bob registered normally (no Twitter link)");

        // Demo 3: Unified entity reviews
        console.log("\n--- Unified Entity Review System ---");

        // Charlie (unregistered) reviews Alice by address
        vm.prank(charlie);
        waffle.submitReview(alice, 3, "Alice is amazing!");
        console.log("Charlie reviewed Alice by address (rating: 3)");

        // Unregistered user reviews Alice by username (should work - different reviewer)
        vm.prank(unregistered);
        waffle.submitUsernameReview("alice_crypto", 2, "Alice via username");
        console.log("Unregistered user reviewed Alice by username (rating: 2)");

        // Charlie tries to review Alice again by username - should fail (same entity)
        vm.prank(charlie);
        try waffle.submitUsernameReview("alice_crypto", 1, "Trying again") {
            console.log("ERROR: Charlie was able to review Alice again!");
        } catch {
            console.log("SUCCESS: Charlie cannot review Alice again by username (same entity)");
        }

        // Demo 4: Check Alice's aggregated stats
        console.log("\n--- Alice's Aggregated Stats ---");
        UserStructs.UserProfile memory aliceProfile = waffle.getUserProfile(alice);
        console.log("Total reviews received:", aliceProfile.totalReviews);
        console.log("Positive reviews:", aliceProfile.positiveReviews);
        console.log("Neutral reviews:", aliceProfile.neutralReviews);
        console.log("Reputation score:", aliceProfile.reputationScore);

        // Demo 5: Unified entity review function
        console.log("\n--- Unified Entity Review Function ---");
        vm.prank(bob);
        waffle.submitEntityReview(alice, "", 1, "Using unified function");
        console.log("Bob reviewed Alice using unified function (rating: 1)");

        vm.prank(bob);
        waffle.submitEntityReview(address(0), "random_user", 3, "Reviewing random user");
        console.log("Bob reviewed random_user using unified function (rating: 3)");

        // Demo 6: Check entity review capabilities
        console.log("\n--- Entity Review Capabilities ---");
        console.log("Can Charlie review Alice by address?", waffle.canReviewEntity(charlie, alice, ""));
        console.log(
            "Can Charlie review Alice by username?", waffle.canReviewEntity(charlie, address(0), "alice_crypto")
        );
        console.log("Can Bob review random_user again?", waffle.canReviewEntity(bob, address(0), "random_user"));

        console.log("\nTotal reviews in system:", waffle.getTotalReviews());
        console.log("Unified Entity Review System demo completed!\n");
    }

    function _demonstrateOneTimeReviews(address alice, address bob, address charlie) internal {
        console.log("\n--- One-Time Review System ---");

        // Alice reviews Bob (positive)
        vm.prank(alice);
        waffle.submitReview(bob, 3, "Excellent collaboration!");
        console.log("Alice reviewed Bob: positive (3/3)");

        // Bob reviews Alice (neutral)
        vm.prank(bob);
        waffle.submitReview(alice, 2, "Good work, room for improvement");
        console.log("Bob reviewed Alice: neutral (2/3)");

        // Charlie reviews both
        vm.prank(charlie);
        waffle.submitReview(alice, 3, "Amazing work!");
        console.log("Charlie reviewed Alice: positive (3/3)");

        vm.prank(charlie);
        waffle.submitReview(bob, 1, "Had some issues");
        console.log("Charlie reviewed Bob: negative (1/3)");

        // Try duplicate review (should fail)
        vm.prank(alice);
        try waffle.submitReview(bob, 2, "Another review") {
            console.log("ERROR: Duplicate review should have failed!");
        } catch {
            console.log("SUCCESS: Duplicate review correctly prevented");
        }

        console.log("One-time review enforcement working correctly");
    }

    function _demonstrateUsernameReviews(address alice, address bob, address charlie) internal {
        console.log("\n--- Username Review System ---");

        // Alice reviews a Twitter user
        vm.prank(alice);
        waffle.submitUsernameReview("elonmusk", 2, "Interesting but controversial tweets");
        console.log("Alice reviewed @elonmusk: neutral (2/3)");

        // Bob reviews the same Twitter user
        vm.prank(bob);
        waffle.submitUsernameReview("elonmusk", 3, "Great tech visionary!");
        console.log("Bob reviewed @elonmusk: positive (3/3)");

        // Charlie reviews a different Twitter user
        vm.prank(charlie);
        waffle.submitUsernameReview("vitalik_eth", 3, "Ethereum founder, amazing work!");
        console.log("Charlie reviewed @vitalik_eth: positive (3/3)");

        // Try duplicate username review (should fail)
        vm.prank(alice);
        try waffle.submitUsernameReview("elonmusk", 1, "Changed my mind") {
            console.log("ERROR: Duplicate username review should have failed!");
        } catch {
            console.log("SUCCESS: Duplicate username review correctly prevented");
        }

        // Show that Alice can review a different username
        vm.prank(alice);
        waffle.submitUsernameReview("naval", 3, "Great wisdom and insights");
        console.log("Alice reviewed @naval: positive (3/3)");

        console.log("Username review system working correctly");
    }

    function _demonstrateLoginStreaks(address alice, address bob) internal {
        console.log("\n--- Login Streak System ---");

        // Update login streaks
        vm.prank(alice);
        waffle.updateLoginStreak();
        console.log("Alice's login streak updated");

        vm.prank(bob);
        waffle.updateLoginStreak();
        console.log("Bob's login streak updated");

        // Simulate time passage and streak break
        vm.warp(block.timestamp + 2 days);

        vm.prank(alice);
        waffle.updateLoginStreak();
        console.log("Alice logged in after 2 days (streak should reset)");
    }

    function _demonstrateBadgeSystem(address alice, address bob) internal {
        console.log("\n--- Badge System ---");

        // Display total badges available
        uint256 totalBadges = waffle.getTotalBadges();
        console.log("Total badges available:", totalBadges);

        // Try to claim badges (users might be eligible after reviews)
        vm.prank(alice);
        try waffle.claimBadge(1) {
            console.log("Alice claimed badge #1");
        } catch {
            console.log("Alice not eligible for badge #1 yet");
        }

        vm.prank(bob);
        try waffle.claimBadge(1) {
            console.log("Bob claimed badge #1");
        } catch {
            console.log("Bob not eligible for badge #1 yet");
        }

        // Display badge information
        BadgeStructs.Badge memory badge = waffle.getBadge(1);
        console.log("Badge #1 name:", badge.name);
        console.log("Badge #1 required score:", badge.requiredScore);
    }

    function _displayDeploymentSummary() internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract Address:", address(waffle));
        console.log("Owner:", waffle.owner());
        console.log("Total Badges Available:", waffle.getTotalBadges());
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Gas Price:", tx.gasprice);

        console.log("\n=== FEATURES IMPLEMENTED ===");
        console.log("- One-time reviews (address-based)");
        console.log("- Username reviews (Twitter-based)");
        console.log("- 1-3 rating scale system");
        console.log("- Login streak tracking");
        console.log("- Soulbound badge NFTs");
        console.log("- Reputation scoring");

        console.log("\n=== NEXT STEPS ===");
        console.log("1. Verify contract on block explorer");
        console.log("2. Set up frontend integration");
        console.log("3. Configure moderators and AI verifiers");
        console.log("4. Test all functionality thoroughly");

        console.log("\n=== ENVIRONMENT VARIABLES USED ===");
        console.log("- PRIVATE_KEY: Deployer private key");
        console.log("- MODERATOR_ADDRESS: Optional moderator address");
        console.log("- AI_VERIFIER_ADDRESS: Optional AI verifier address");
    }

    // Utility function to display user stats
    function displayUserStats(address user, string memory name) public view {
        UserStructs.UserProfile memory profile = waffle.getUserProfile(user);
        uint256[] memory reviews = waffle.getUserReviews(user);

        console.log("\n--- %s Stats ---", name);
        console.log("Reputation Score:", profile.reputationScore);
        console.log("Total Reviews Received:", profile.totalReviews);
        console.log("Positive Reviews:", profile.positiveReviews);
        console.log("Neutral Reviews:", profile.neutralReviews);
        console.log("Negative Reviews:", profile.negativeReviews);
        console.log("Current Login Streak:", profile.loginStreak);
        console.log("Last Login Date:", profile.lastLoginDate);
        console.log("Review IDs Count:", reviews.length);
        console.log("Owned Badges Count:", profile.ownedBadges.length);
    }
}
