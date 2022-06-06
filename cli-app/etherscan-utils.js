const {
  ETHERSCAN_API_KEY,
  SNOWTRACE_API_KEY,
  BSCSCAN_API_KEY,
  POLYSCAN_API_KEY,
} = require('./constants')

const axios = require('axios')

// API Base URLs for each protocol
const ETHERSCAN_API = 'https://api.etherscan.io/api'
const BSCSCAN_API = 'https://api.bscscan.com/api'
const SNOWTRACE_API = 'https://api.snowtrace.io/api'
const POLYSCAN_API = 'https://api.polygonscan.com/api'

const getBlockByTimestamp = async (chain, timestamp) => {
  console.log(`Getting block for chain ${chain} and timestamp ${timestamp}`)
  let queryParams, baseURL
  switch (chain) {
    case 'Ethereum':
      baseURL = ETHERSCAN_API
      queryParams = `?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`

      break
    case 'Avalanche':
      baseURL = SNOWTRACE_API
      queryParams = `?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${SNOWTRACE_API_KEY}`
      break
    case 'Binance':
      baseURL = BSCSCAN_API
      queryParams = `?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${BSCSCAN_API_KEY}`
      break
    case 'Polygon':
      baseURL = POLYSCAN_API
      queryParams = `?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${POLYSCAN_API_KEY}`
    default:
      break
  }

  const endpoint = `${baseURL}${queryParams}`
  // console.log('endpoint', endpoint)
  try {
    const res = await axios.get(endpoint)
    // console.log('res.data', res.data)
    return res.data.result
    // if (res.data.message == 'OK') return res.data.result
    // return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  getBlockByTimestamp,
}
