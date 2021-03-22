# near-research-poc
## Setup
```
npm install
node app.js
```
Two accounts on the NEAR testnet is needed, use the example .env below or create them at https://wallet.testnet.near.org/. (Since it uses browser cache the second can be created in a separate browser or in an incognito tab.)
Create a .env file with the following template:
```
SENDER_ACCOUNT_ID=""
RECEIVER_ACCOUNT_ID=""
SENDER_PRIVATE_KEY=""
RECEIVER_PRIVATE_KEY=""
```
where the private keys can be found in the browsers local storage:![](
https://raw.githubusercontent.com/aronbsz/near-research-poc/main/private_key_loc.png)

An example of the .env file (which should work out of the box until the NEAR runs out on the Sender):
```
SENDER_ACCOUNT_ID="nearpoc1.testnet"
RECEIVER_ACCOUNT_ID="nearpoc2.testnet"
SENDER_PRIVATE_KEY="ed25519:42z6pUQLQgypVcCNhEsPvHvQ8Cnsy8KoUciGgxivPW6jUEi8e9ss6bfb6y2aJeo37cy8XGkGgKYbn5smbLSPtjx1"
RECEIVER_PRIVATE_KEY="ed25519:TnUrP5qbJy2uWNzKWZUJbaAK5fcB5ssmYj1YKgotwGguhR9X4yZcpPArfoVo9nm59DKANMc4nLuLDGSJUbZTk8G"
```
