// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";;

contract Deployer is Script {
    function run() public {
        vm.startBroadcast();

        // Step 1: Deploy

        vm.stopBroadcast();
    }
}
