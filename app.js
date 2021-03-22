const nearAPI = require("near-api-js");
const { connect, KeyPair, keyStores, utils } = nearAPI;
require("dotenv").config();

async function logBalance(sender, receiver, config){
  const near = await connect(config);
  const senderAccount = await near.account(sender);
  const receiverAccount = await near.account(receiver);
  console.log(`Sender balance before: ${nearAPI.utils.format.formatNearAmount(await (await senderAccount.getAccountBalance()).total)}Ⓝ`);
  console.log(`Receiver balance before: ${nearAPI.utils.format.formatNearAmount(await (await receiverAccount.getAccountBalance()).total)}Ⓝ`);
}

async function simpleNearTransaction(){
  const sender = process.env.SENDER_ACCOUNT_ID;
  const receiver = process.env.RECEIVER_ACCOUNT_ID;

  //Using testnet for the PoC, but 'mainnet' and 'betanet' also viable.
  const networkId = "testnet";

  //Convert 1.5 NEAR to Yocto
  const amount = nearAPI.utils.format.parseNearAmount("1");

  // sets up an empty keyStore object in memory using near-api-js
  const keyStore = new keyStores.InMemoryKeyStore();
  // creates a keyPair from the private key provided in your .env file
  const senderKeyPair = KeyPair.fromString(process.env.SENDER_PRIVATE_KEY);
  const receiverKeyPair = KeyPair.fromString(process.env.RECEIVER_PRIVATE_KEY);
  // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
  await keyStore.setKey(networkId, sender, senderKeyPair);
  await keyStore.setKey(networkId, receiver, receiverKeyPair);

  // configuration used to connect to NEAR
  const config = {
    networkId,
    keyStore,
    nodeUrl: `https://rpc.${networkId}.near.org`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    explorerUrl: `https://explorer.${networkId}.near.org`
  };

  await logBalance(sender, receiver, config);

  const near = await connect(config);
  const senderAccount = await near.account(sender);

  console.log(`Attempting to send 1 NEAR from ${sender} to ${receiver}...`);
  const result = await senderAccount.sendMoney(receiver, amount);

  console.log('Transaction Results: ', result.transaction);
  console.log('--------------------------------------------------------------------------------------------');
  console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
  console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
  console.log('--------------------------------------------------------------------------------------------');

  await logBalance(sender, receiver, config);
}
simpleNearTransaction();