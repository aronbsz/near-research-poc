const nearAPI = require("near-api-js")
const { functionCall } = require("near-api-js/lib/transaction")
const { base_encode } = require("near-api-js/lib/utils/serialize")
const { connect, KeyPair, keyStores, utils } = nearAPI
require("dotenv").config()

async function logBalance(near, sender, receiver){
  const senderAccount = await near.account(sender)
  const receiverAccount = await near.account(receiver)
  console.log(`Sender balance: ${nearAPI.utils.format.formatNearAmount(await (await senderAccount.getAccountBalance()).total)}Ⓝ`)
  console.log(`Receiver balance: ${nearAPI.utils.format.formatNearAmount(await (await receiverAccount.getAccountBalance()).total)}Ⓝ`)
}

function logTransactionSuccess(near, result){
  console.log('Transaction Successful!')
  console.log('--------------------------------------------------------------------------------------------')
  console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!')
  console.log(`${near.config.explorerUrl}/transactions/${result.transaction.hash}`)
  console.log('--------------------------------------------------------------------------------------------')
}


async function simpleNearTransaction(near, sender, receiver, amount){
  await logBalance(near, sender, receiver)

  const senderAccount = await near.account(sender)

  console.log(`Attempting to send ${nearAPI.utils.format.formatNearAmount(amount)} NEAR from ${sender} to ${receiver}...`)
  const result = await senderAccount.sendMoney(receiver, amount)

  logTransactionSuccess(near, result)

  await logBalance(near, sender, receiver)
}

async function getValidatorPubKeyFromAccountId(near, accountId){
  const validators = await near.connection.provider.validators()
  for(const [key,validator] of validators.current_validators.entries()){
    if(validator.account_id == accountId){
      return validator.public_key
    }
  }
}

async function stake(near, stakerAccountId, validatorAccountId, amount){
  console.log(`Attempting to delegate ${nearAPI.utils.format.formatNearAmount(amount)} NEAR to ${validatorAccountId}...`)
  const senderAccount = await near.account(stakerAccountId)
  const validatorPubKey = await getValidatorPubKeyFromAccountId(near, validatorAccountId)
  const result = await senderAccount.signAndSendTransaction(validatorAccountId, [
    functionCall('deposit_and_stake', {}, 25000000000000 * 5, amount)
  ])
  logTransactionSuccess(near, result)
}
async function main(){
  //Using testnet for the PoC, but 'mainnet' and 'betanet' also viable.
  const networkId = "testnet"

  const sender = process.env.SENDER_ACCOUNT_ID
  const receiver = process.env.RECEIVER_ACCOUNT_ID

  // sets up an empty keyStore object in memory using near-api-js
  const keyStore = new keyStores.InMemoryKeyStore()
  // creates a keyPair from the private key provided in your .env file
  const senderKeyPair = KeyPair.fromString(process.env.SENDER_PRIVATE_KEY)
  const receiverKeyPair = KeyPair.fromString(process.env.RECEIVER_PRIVATE_KEY)
  // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
  await keyStore.setKey(networkId, sender, senderKeyPair)
  await keyStore.setKey(networkId, receiver, receiverKeyPair)

    // configuration used to connect to NEAR
    const config = {
      networkId,
      keyStore,
      nodeUrl: `https://rpc.${networkId}.near.org`,
      walletUrl: `https://wallet.${networkId}.near.org`,
      helperUrl: `https://helper.${networkId}.near.org`,
      explorerUrl: `https://explorer.${networkId}.near.org`
    }

  const near = await nearAPI.connect(config)

  //Convert 1 NEAR to Yocto
  const amount = nearAPI.utils.format.parseNearAmount("1")

  await simpleNearTransaction(near, sender, receiver, amount)
  const validatorId = process.env.VALIDATOR_ID
  await stake(near, receiver, validatorId, amount)
}
main()