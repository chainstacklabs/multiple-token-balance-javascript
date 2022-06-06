# The ultimate guide to token balances

This repository contains code examples to obtain balances from multiple ERC20 tokens for a blockchain wallet. Check out `Article.md` file for a complete description of how to query balances.

## CLI app

The cli-app folder contains an app that can be used to query token balances from different blockchain protocols from the command line. Supported blockchains are: Ethereum, Binance Smart Chain, Avalanche and Polygon.

### CLI app requirements

This app requires access to blockchain archive nodes via RPC. In addition, it uses the APIs from Etherscan, Snowtrace, BscScan and PolygonScan so API keys for all those are also requred.

Both archive nodes endpoints and API keys must be configured in an .env file. Just enter the values in the `.env.example` file and rename it to `.env`.

### Installation and run

Install all dependencies with `npm i`. Start the CLI program with `node index.js`
