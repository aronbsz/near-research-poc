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

## Developing Near
The most straightforward way of issuing JSON RPC calls to the blockchain is through the [near js api](https://link). The [documentation](https://docs.near.org/docs/develop/front-end/near-api-js)  of it is quite thourough, specifically the [quick reference](https://docs.near.org/docs/api/naj-quick-reference) is a good place to start. Delegation through the JS api is underexplained in my opinion, and can be tricky, since delegation on Near is a function call of a smart contract. A good reference on actually implementing this can be found in the official Near wallet implementations [staking actions](https://github.com/near/near-wallet/blob/master/src/actions/staking.js).

## Staking on Near
### Technicalities
Delegation is [still (at least somewhat) in development](https://docs.near.org/docs/validator/economics#borrow-near-tokens-via-stake-delegation). On Near, validators can expose their own smart contracts, through which delegators can communicate with their node. These contracts must implement certain [change and view methods](https://github.com/near/NEPs/pull/27), making the delegation from our side as simple as a contract call to the validator node's account ID (as seen in this PoC). While certain validators use the [core smart contracts](https://github.com/near/core-contracts) developed by Near, some have created their own implementations, with their own usages.

### Basics
Validation is done on an _epoch-by-epoch_ basis, where _epoch_ is variable, currently being around 12 hours. At the end of each epoch, new validators might start validating, while current validators get re-enrolled, re-staking the assets within and adding the rewards. Validators failing to provide a minimum threshold of chunks and blocks within each epoch get kicked out, and lose their rewards. If a validator deviates from the protocol (producing invalid blocks or chunks) the funds (*of the validator, not the delegators*) get slashed.

Since delegation is not supproted on a protocol-level, rather being dynamic through smart-contract implementations, there are no official restrictions on delegation. Different validator nodes with different smart contracts might have separate restrictions based on implementation.

### Delegation workflow
Source: [official docs](https://docs.near.org/docs/validator/delegation), and [official wallet implementation](https://github.com/near/near-wallet/blob/master/src/actions/staking.js)
The workflow differs for [locked-up](https://docs.near.org/docs/tokens/lockup) and non-locked-up accounts.

1. Non-locked-up (normal) accounts
- Find a validator that suits the users interest.
- Call the `deposit_and_stake` smart contract method of the validator with the amount to stake
- Delegated stake gets re-staked each epoch (and if it meets the requirements acquires rewards along the way that get re-staked as well)
- To unstake funds, the user must call the `unstake` method on the same validator with a specified amount, or the `unstake_all` method to unstake all their funds. After this, the funds are *locked for 4 epochs* (currently ~52-65hrs hours).
- Once funds have been unstaked for 3 epochs, user can call `withraw` with amount or `withraw_all` to actually get their funds back on their balance.

2. Locked-up accounts
- Locked-up accounts, while not able to transfer their tokens, can stake them, as long as the leave a set amount in their account.
- Access is needed to the lockup contract where the funds are held.
- Lockup contracts can only stake to one staking pool at a time, which needs to be explicitly set up.:
If they have no staking pool selected, a `select_staking_pool` function call is necessary. If they already have a staking pool selected, but no longer have any funds staked, an `unselect_staking_pool` is needed before selecting a new one. Once a staking pool is set up, they can delegate using the `deposit_and_stake` function call.

- Locked-up accounts can unstake using the same `unstake` and `unstake_all` calls, and need to wait for the same (4 epoch) time period afterwards.
- Withrawing uses the same mechanics as well, but the funds themselves return to the lockup contract rather than the users balance.

