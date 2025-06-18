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
	--broadcast \
	--verify \
	--verifier <type_verifier> \
	--verifier-url <url_soon> \
	script/Deployer.s.sol:Deployer