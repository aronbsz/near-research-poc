# near-research-poc
## Setup
```
npm install
node app.js
```
Create a .env file, either with this pre-made template:
```
SENDER_ACCOUNT_ID="nearpoc1.testnet"
RECEIVER_ACCOUNT_ID="nearpoc2.testnet"
SENDER_PRIVATE_KEY="ed25519:42z6pUQLQgypVcCNhEsPvHvQ8Cnsy8KoUciGgxivPW6jUEi8e9ss6bfb6y2aJeo37cy8XGkGgKYbn5smbLSPtjx1"
RECEIVER_PRIVATE_KEY="ed25519:TnUrP5qbJy2uWNzKWZUJbaAK5fcB5ssmYj1YKgotwGguhR9X4yZcpPArfoVo9nm59DKANMc4nLuLDGSJUbZTk8G"
VALIDATOR_ID="legends.pool.f863973.m0"

```
or manually create two accounts at https://wallet.testnet.near.org/. The `ACCOUNT_ID` and `PRIVATE_KEY` fields are straightforward to fill, while the `VALIDATOR_ID` should be the account ID of any active validator on the NEAR testnet. The _staking_ tab in the NEAR Wallet shows a list of these, as well as the [explorer page](https://explorer.testnet.near.org/nodes/validators).
