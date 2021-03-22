# near-research-poc
## Setup
```
npm install
node app.js
```
Two accounts on the NEAR testnet is needed, create them at https://wallet.testnet.near.org/. (Since it uses browser cache the second can be created in a separate browser or in an incognito tab.)
Create a .env file with the following template:
```
SENDER_ACCOUNT_ID="nearpoc1.testnet"
RECEIVER_ACCOUNT_ID="nearpoc2.testnet"
SENDER_PRIVATE_KEY=".."
RECEIVER_PRIVATE_KEY=".."
```
where the private keys can be found in the browsers local storage:![](
https://raw.githubusercontent.com/aronbsz/near-research-poc/main/private_key_loc.png)

