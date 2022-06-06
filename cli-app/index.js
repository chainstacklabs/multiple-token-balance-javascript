#!/usr/bin/env node
const fs = require('fs')

const { format } = require('date-fns')
var inquirer = require('inquirer')
const { getBlockByTimestamp } = require('./etherscan-utils')
const {
  initProvider,
  getCurrentBlock,
  getSingleTokenBalance,
  getTokens,
  getAllTokenBalances,
} = require('./utils')
const today = format(new Date(), 'YYY/MM/dd')

let questions = [
  {
    type: 'list',
    name: 'protocol',
    message: 'Which blockchain do you want to query?',
    choices: [
      'Ethereum',
      'Avalanche',
      'Binance',
      'Polygon',
      // 'Solana',
      // 'Phantom',
    ],
    default: 0,
  },
  {
    type: 'list',
    name: 'multipleTokens',
    message: 'How many tokens do you want to query?',
    choices: ['Single token', 'All'],
    default: 0,
  },
  {
    type: 'input',
    name: 'tokenAddress',
    message: 'What is the token address? (default Eth. USDC)',
    when: (answers) => answers.multipleTokens === 'Single token',
    default: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  {
    type: 'input',
    name: 'dateFrom',
    message: 'Date you want to query from? (format YYYY/MM/DD)',
    default: today,
  },
  {
    type: 'input',
    name: 'wallet',
    message: 'What is the wallet address you want to check?',
  },
]

inquirer
  .prompt(questions)
  .then(async (answers) => {
    // console.log('answers', answers)
    let blockNumber

    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // always init provider with archive node
    initProvider(answers.protocol)

    if (answers.dateFrom == today) {
      console.log('Checking balance for today...')
      blockNumber = await getCurrentBlock()
    } else {
      // get block number for date or ask user
      console.log('Not from today')
      // generate Unix timestamp from date
      const dateFrom = Math.floor(new Date(answers.dateFrom).getTime() / 1000)

      console.log('dateFrom', dateFrom)
      // console.log('dateFrom.getTime()', dateFrom.)
      blockNumber = await getBlockByTimestamp(answers.protocol, dateFrom)
    }

    // console.log('blockNumber', blockNumber)
    if (answers.multipleTokens == 'Single token') {
      const balanceDetails = await getSingleTokenBalance(
        answers.tokenAddress,
        answers.wallet,
        blockNumber
      )
      console.log(`Wallet balance on ${today} is %o`, balanceDetails)
    } else {
      console.time('Retrieved tokens and balances in ')
      // multiple tokens
      const tokens = await getTokens(answers.protocol)
      console.log(`🧮 Retrieved ${tokens.length} ERC20 tokens`)

      const results = await getAllTokenBalances(
        tokens,
        answers.wallet,
        blockNumber
      )
      results.sort((a, b) => (a.balance < b.balance ? 1 : -1))

      // console.log(`Retrieved ${results.length} token balances`)
      console.timeEnd('Retrieved tokens and balances in ')
      console.log(`💨💨💨💨💨💨💨💨`)
      // write balances to json file
      fs.writeFileSync(
        `./balances-${answers.protocol}.json`,
        JSON.stringify(results)
      )
      console.log(
        `Results sorted and saved in balances-${answers.protocol}.json file`
      )
    }
  })
  .catch((error) => {
    console.error(error)
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
