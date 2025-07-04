# 🧇 Waffle Smart Contracts

The smart contract infrastructure for Waffle - a comprehensive suite of Solidity contracts that power the on-chain reputation and badge system for the decentralized trust platform.

## 🌟 Features

- **🏆 Badge System**: On-chain badge creation, management, and verification
- **📊 Reputation Tracking**: Decentralized reputation scoring and validation
- **👥 User Management**: Wallet-based user registration and profile management
- **🔍 Review System**: Immutable review storage and verification
- **🛡️ Security**: Built with OpenZeppelin's battle-tested contracts
- **⚡ Gas Optimized**: Efficient contract design for minimal transaction costs

## 🚀 Tech Stack

### Development Framework

- **Foundry** - Fast, portable Ethereum development toolkit
- **Forge** - Testing framework for Solidity
- **Cast** - Command-line tool for Ethereum interaction
- **Anvil** - Local Ethereum node for development

### Smart Contract Libraries

- **OpenZeppelin Contracts** - Secure, audited contract implementations
- **Solidity ^0.8.19** - Latest stable Solidity version
- **forge-std** - Standard library for Foundry testing

### Development Tools

- **Slither** - Static analysis security tool
- **Mythril** - Security analysis framework
- **Hardhat** - Additional tooling support

## 📁 Project Structure

```text
contracts/
├── src/                           # Contract source code
│   ├── Waffle.sol                # Main contract aggregator
│   ├── enums/                    # Enum definitions
│   │   └── WaffleEnums.sol       # Platform enums
│   ├── errors/                   # Custom error definitions
│   │   └── WaffleErrors.sol      # Platform-specific errors
│   ├── interfaces/               # Contract interfaces
│   │   ├── IBadgeSystem.sol      # Badge system interface
│   │   ├── IReviewSystem.sol     # Review system interface
│   │   └── IUserManagement.sol   # User management interface
│   ├── libraries/                # Reusable libraries
│   │   ├── ReputationLib.sol     # Reputation calculation logic
│   │   └── ValidationLib.sol     # Input validation utilities
│   └── structs/                  # Data structure definitions
│       ├── BadgeStructs.sol      # Badge-related structures
│       ├── ReviewStructs.sol     # Review data structures
│       └── UserStructs.sol       # User profile structures
├── test/                         # Contract tests
│   └── Waffle.t.sol             # Comprehensive test suite
├── script/                       # Deployment scripts
│   └── Waffle.s.sol             # Deployment script
├── lib/                          # External dependencies
│   ├── forge-std/               # Foundry standard library
│   └── openzeppelin-contracts/   # OpenZeppelin contracts
├── foundry.toml                  # Foundry configuration
├── Makefile                      # Build automation
└── remappings.txt               # Import path mappings
```

## 🛠️ Development Setup

### Prerequisites

- **Foundry** - Install from [getfoundry.sh](https://getfoundry.sh/)
- **Git** - For dependency management
- **Node.js** (optional) - For additional tooling

### Installation

1. **Navigate to contracts directory**

   ```bash
   cd contracts
   ```

2. **Install Foundry dependencies**

   ```bash
   forge install
   ```

3. **Build contracts**

   ```bash
   forge build
   ```

4. **Run tests**

   ```bash
   forge test
   ```

## 📜 Available Commands

### Building & Testing

```bash
# Build all contracts
forge build

# Run all tests
forge test

# Run tests with verbosity
forge test -vvv

# Run specific test
forge test --match-test testFunctionName

# Generate gas snapshots
forge snapshot

# Check test coverage
forge coverage
```

### Code Quality

```bash
# Format code
forge fmt

# Static analysis (requires slither)
slither .

# Generate documentation
forge doc
```

### Local Development

```bash
# Start local Ethereum node
anvil

# Deploy to local network
forge script script/Waffle.s.sol --fork-url http://localhost:8545 --broadcast
```

## 🏗️ Contract Architecture

### Core Contracts

#### Waffle.sol

Main contract that aggregates all platform functionality:

- User registration and management
- Badge system coordination
- Review system integration
- Reputation calculation orchestration

#### Badge System

- **IBadgeSystem.sol**: Interface defining badge operations
- **BadgeStructs.sol**: Badge data structures
- Functions for creating, awarding, and verifying badges

#### Review System

- **IReviewSystem.sol**: Interface for review operations
- **ReviewStructs.sol**: Review data structures
- Immutable review storage and verification

#### User Management

- **IUserManagement.sol**: User operations interface
- **UserStructs.sol**: User profile structures
- Wallet-based user registration and profile management

### Libraries

#### ReputationLib.sol

- Reputation score calculation algorithms
- Weighted scoring based on multiple factors
- Historical reputation tracking

#### ValidationLib.sol

- Input validation utilities
- Data sanitization functions
- Security check implementations

## 🔧 Configuration

### foundry.toml

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.19"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
mainnet = "https://eth-mainnet.alchemyapi.io/v2/${API_KEY}"
sepolia = "https://eth-sepolia.g.alchemy.com/v2/${API_KEY}"
polygon = "https://polygon-mainnet.alchemyapi.io/v2/${API_KEY}"
```

### Environment Variables

Create `.env` file:

```env
# RPC URLs
MAINNET_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# Private Keys (for deployment)
PRIVATE_KEY=your_deployment_private_key

# Etherscan API (for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🚀 Deployment

### Local Deployment

```bash
# Start local node
anvil

# Deploy to local network
forge script script/Waffle.s.sol --fork-url http://localhost:8545 --broadcast
```

### Testnet Deployment

```bash
# Deploy to Sepolia
forge script script/Waffle.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

### Mainnet Deployment

```bash
# Deploy to mainnet (use with caution)
forge script script/Waffle.s.sol --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## 🧪 Testing Strategy

### Test Categories

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Contract interaction testing
3. **Fuzz Tests**: Property-based testing with random inputs
4. **Invariant Tests**: System state validation

### Test Structure

```solidity
// Example test structure
contract WaffleTest is Test {
    Waffle public waffle;

    function setUp() public {
        waffle = new Waffle();
    }

    function testUserRegistration() public {
        // Test user registration functionality
    }

    function testFuzz_BadgeCreation(string memory name) public {
        // Fuzz test badge creation with random inputs
    }
}
```

### Running Tests

```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/Waffle.t.sol

# Run with coverage
forge coverage --report lcov
```

## 🔐 Security Considerations

### Implemented Security Measures

- **Access Control**: Role-based permissions using OpenZeppelin's AccessControl
- **Reentrancy Protection**: ReentrancyGuard for state-changing functions
- **Input Validation**: Comprehensive validation using ValidationLib
- **Integer Overflow**: SafeMath patterns and Solidity 0.8+ built-in protection

### Security Audits

1. **Slither Analysis**: Automated vulnerability detection
2. **Manual Review**: Comprehensive code review process
3. **Formal Verification**: Mathematical proof of contract correctness
4. **Bug Bounty**: Community-driven security testing

### Best Practices

- Minimal external dependencies
- Clear separation of concerns
- Extensive testing coverage
- Gas optimization without compromising security

## 📊 Gas Optimization

### Optimization Techniques

- **Packed Structs**: Efficient storage layout
- **Batch Operations**: Multiple operations in single transaction
- **Storage vs Memory**: Optimal variable placement
- **Function Visibility**: Proper visibility modifiers

### Gas Reports

```bash
# Generate gas report
forge test --gas-report

# Snapshot gas usage
forge snapshot
```

## 🔗 Integration

### Frontend Integration

```javascript
// Example integration with wagmi/viem
import { useContractWrite } from "wagmi";
import WaffleABI from "./abi/Waffle.json";

const { write } = useContractWrite({
  address: WAFFLE_CONTRACT_ADDRESS,
  abi: WaffleABI,
  functionName: "createBadge",
});
```

### Backend Integration

```javascript
// Example with ethers.js
const waffle = new ethers.Contract(WAFFLE_CONTRACT_ADDRESS, WaffleABI, provider);

const badges = await waffle.getUserBadges(userAddress);
```

## 🤝 Contributing

1. Follow Solidity style guide
2. Add comprehensive tests for new features
3. Include natspec documentation
4. Ensure gas efficiency
5. Security-first development approach

## 🔗 Related Services

- **Frontend**: [../web/README.md](../web/README.md)
- **Backend API**: [../engine/README.md](../engine/README.md)
- **Scraper Service**: [../scraper/README.md](../scraper/README.md)

## 📚 Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

Built with ⚡ using Foundry and OpenZeppelin's secure contract libraries
