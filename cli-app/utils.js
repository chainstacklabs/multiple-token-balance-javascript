const axios = require('axios')

const { ethers } = require('ethers')

const { ERC20_ABI, ENDPOINTS, TOKEN_LISTS } = require('./constants.js')

let provider, contract

const initProvider = (chain) => {
  console.log(`Initialising provider for ${chain}`)
  provider = new ethers.providers.JsonRpcProvider(ENDPOINTS[chain])
}

const getTokens = async (chain) => {
  // get token list URL from constants file by chain
  const tokenSource = TOKEN_LISTS[chain]
  // retrieve token list from URL
  const res = await axios.get(tokenSource)
  return res.data
}

/**
 *
 * @param {*} hex the original value in hex format
 * @param {*} decimals the number of decimals used by the token, default 18
 * @returns
 */
const convertToNumber = (hex, decimals = 18) => {
  if (!hex) return 0
  // console.log(`Converting to number ${hex} with ${decimals} decimals`)

  return ethers.utils.formatUnits(hex, decimals)
}

/**
 *
 * @returns the current block using the initialized provider
 */
const getCurrentBlock = async () => {
  const res = await provider.getBlockNumber()
  console.log(`⛓ Current block is ${res} `)
  return res
}

/**
 *
 * @returns object with name, decimals and symbol of the erc20 token contract
 */
const getTokenDetails = async () => {
  console.log(`Retrieving ERC20 token details...`)
  const decimals = await contract.decimals()
  const name = await contract.name()
  const symbol = await contract.symbol()

  return { name, decimals, symbol }
}
/**
 * initialises the contract instance
 * @param {*} address address of the ERC20 token contract
 */
const initContract = async (address) => {
  // initialise contract instance
  contract = new ethers.Contract(address, ERC20_ABI, provider)
  console.log('ERC20 Token contract initialised!')
}

/**
 *
 * @param {*} tokenAddress the address of the ERC20 token
 * @param {*} wallet address to query
 * @param {*} block  block number
 * @returns an object with the contract name, decimals and symbol
 */
const getSingleTokenBalance = async (tokenAddress, wallet, block) => {
  await initContract(tokenAddress)

  const balanceBN = await contract.balanceOf(wallet, {
    blockTag: +block,
  })
  const tokenDetails = await getTokenDetails()
  // transforms to number
  const balance = convertToNumber(balanceBN, tokenDetails.decimals)

  return {
    name: tokenDetails.name,
    symbol: tokenDetails.symbol,
    balance: balance,
  }
}
/**
 * Loops through a token list to retrieve balances for a given wallet
 * @param {*} tokenList array of tokens with address, symbol, decimals and name
 * @param {*} wallet address to query balance from
 * @param {*} block block number to query past balances
 * @returns Array of balances
 */
const getAllTokenBalances = async (tokenList, wallet, block) => {
  // array to store all balance requests
  let proms = []
  // array to store balances
  let results = []

  for (const tkn of tokenList) {
    // create ERC20 token contract instance
    const erc20 = new ethers.Contract(tkn.address, ERC20_ABI, provider)
    // save request in array of Promises
    proms.push(
      erc20.balanceOf(wallet, {
        blockTag: +block,
      })
    )
  }
  // actually requests all balances
  const promiseResults = await Promise.allSettled(proms)
  // loop through all responses to format response
  for (let index = 0; index < promiseResults.length; index++) {
    // transforms balance to decimal
    const bal = convertToNumber(
      promiseResults[index].value,
      tokenList[index].decimals
    )
    results.push({
      name: tokenList[index].name,
      symbol: tokenList[index].symbol,
      balance: bal,
    })
  }

  return results
}

module.exports = {
  convertToNumber,
  getTokens,
  getSingleTokenBalance,
  getAllTokenBalances,
  initProvider,
  getCurrentBlock,
}
