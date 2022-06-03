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

const getTokenDetails = async () => {
  console.log(`Retrieving ERC20 token details...`)
  const decimals = await contract.decimals()
  // console.log('decimals >>', decimals)
  const name = await contract.name()
  // console.log('name', name)
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
  // console.log('balanceBN', balanceBN)
  const tokenDetails = await getTokenDetails()
  // console.log('tokenDetails', tokenDetails)
  // transforms to number
  const balance = convertToNumber(balanceBN, tokenDetails.decimals)

  return {
    name: tokenDetails.name,
    symbol: tokenDetails.symbol,
    balance: balance,
  }
}

const getAllTokenBalances = async (tokenList, wallet, block) => {
  let results = []
  let proms = []

  for (const tkn of tokenList) {
    // console.log('Creating request for ', tkn.name)
    const erc20 = new ethers.Contract(tkn.address, ERC20_ABI, provider)

    proms.push(
      erc20.balanceOf(wallet, {
        blockTag: +block,
      })
    )
  }
  const promsRes = await Promise.allSettled(proms)

  for (let index = 0; index < promsRes.length; index++) {
    // console.log('tokenList[index].decimals', tokenList[index].decimals)
    // console.log('promsRes[index]', promsRes[index])
    const bal = convertToNumber(
      promsRes[index].value,
      tokenList[index].decimals
    )
    results.push({
      name: tokenList[index].name,
      symbol: tokenList[index].symbol,
      balance: bal,
    })
  }

  // console.log('results', results)
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
