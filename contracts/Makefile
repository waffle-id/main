.PHONY: install
install:
	forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts --no-git

.PHONY: deploy
deploy:
	set +a; \
	source .env; \
	set -a; \
	forge script \
	--rpc-url $$RPC_URL \
	--private-key $$PRIVATE_KEY \
	--verifier-url $$VERIFIER_URL \
	--etherscan-api-key $$ETHERSCAN_API_KEY \
	--broadcast \
	--verify \
	--verifier etherscan \
	--optimize \
	--skip-simulation \
	script/Waffle.s.sol:WaffleDeployment