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
        bool setupAIVerifier;
        bool registerDeployer;
        bool runDemo;
        bool verbose;
    }

    function run() external {
        DeploymentConfig memory config = DeploymentConfig({
            setupModerators: true,
            setupAIVerifier: true,
            registerDeployer: false,
            runDemo: false,
            verbose: true
        });

        _deploy(config);
    }

    function deployMainnet() external {
        DeploymentConfig memory config = DeploymentConfig({
            setupModerators: true,
            setupAIVerifier: true,
            registerDeployer: false,
            runDemo: false,
            verbose: true
        });

        console.log("=== MAINNET DEPLOYMENT ===");
        _deploy(config);
    }

    function deployTestnet() external {
        DeploymentConfig memory config = DeploymentConfig({
            setupModerators: true,
            setupAIVerifier: true,
            registerDeployer: true,
            runDemo: true,
            verbose: true
        });

        console.log("=== TESTNET DEPLOYMENT ===");
        _deploy(config);
    }

    function deployDev() external {
        DeploymentConfig memory config = DeploymentConfig({
            setupModerators: false,
            setupAIVerifier: false,
            registerDeployer: true,
            runDemo: true,
            verbose: true
        });

        console.log("=== DEVELOPMENT DEPLOYMENT ===");
        _deploy(config);
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

        // Setup AI verifier
        if (config.setupAIVerifier) {
            _setupAIVerifier();
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

    function _setupAIVerifier() internal {
        try vm.envAddress("AI_VERIFIER_ADDRESS") returns (address aiVerifier) {
            if (aiVerifier != address(0)) {
                waffle.setAIVerifier(aiVerifier, true);
                console.log("AI Verifier set:", aiVerifier);
            }
        } catch {
            console.log("No AI_VERIFIER_ADDRESS provided");
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

        // Demonstrate login streaks
        _demonstrateLoginStreaks(alice, bob);

        // Demonstrate badge system
        _demonstrateBadgeSystem(alice, bob);
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
        try waffle.claimBadge(0) {
            console.log("Alice claimed badge #0");
        } catch {
            console.log("Alice not eligible for badge #0 yet");
        }

        vm.prank(bob);
        try waffle.claimBadge(0) {
            console.log("Bob claimed badge #0");
        } catch {
            console.log("Bob not eligible for badge #0 yet");
        }

        // Display badge information
        BadgeStructs.Badge memory badge = waffle.getBadge(0);
        console.log("Badge #0 name:", badge.name);
        console.log("Badge #0 required score:", badge.requiredScore);
    }

    function _displayDeploymentSummary() internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract Address:", address(waffle));
        console.log("Owner:", waffle.owner());
        console.log("Total Badges Available:", waffle.getTotalBadges());
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Gas Price:", tx.gasprice);

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

    // Emergency functions for post-deployment management
    function emergencyPause() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Add emergency pause functionality if implemented in main contract
        console.log("Emergency pause functionality would be called here");

        vm.stopBroadcast();
    }

    function transferOwnership(address newOwner) external {
        require(newOwner != address(0), "Invalid new owner");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        waffle.transferOwnership(newOwner);
        console.log("Ownership transferred to:", newOwner);

        vm.stopBroadcast();
    }
}
