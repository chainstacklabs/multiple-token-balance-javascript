// loads env file
require('dotenv').config()

const WALLET = process.env.WALLET
const BLOCK_NUMBER = process.env.BLOCK_NUMBER || 0
const ENDPOINTS = {
  Ethereum: process.env.ETH_ARCHIVE_NODE,
  Avalanche: process.env.AVA_ARCHIVE_NODE,
  Binance: process.env.BNB_ARCHIVE_NODE,
  Polygon: process.env.POLY_ARCHIVE_NODE,
}

const TOKEN_LISTS = {
  Ethereum:
    'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/ethereum.json',
  Avalanche:
    'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/avax.json',
  Binance:
    'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/bsc.json',
  Polygon:
    'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json',
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

module.exports = {
  ERC20_ABI,
  WALLET,
  BLOCK_NUMBER,
  ENDPOINTS,
  ETHERSCAN_API_KEY,
  SNOWTRACE_API_KEY,
  BSCSCAN_API_KEY,
  POLYSCAN_API_KEY,
  TOKEN_LISTS,
}
