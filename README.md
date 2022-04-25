# royalty aware marketplace sample

`ClosedDesert` allows users to offer their NFTs for a fixed price. 
The marketplace obeys the purchased collection's royalty rules
and distributes fees accordingly. It uses the general [Royalty Registry](https://royaltyregistry.xyz/)
fee lookup contract on mainnet.

## running

To test this under real life conditions against arbitrary NFT collections, it's best executed on a local **fork of mainnet**. This is how you could achieve that using [truffle](https://trufflesuite.com/) and [ganache](https://github.com/trufflesuite/ganache):

- go to your favorite (real) marketplace and find two real world addresses that own ERC721 NFTs and some Eth for gas. Take a note of the NFT collection's contract address.
- get yourself an [Infura key](https://infura.io) to get access to mainnet nodes
- fork mainnet instantly on your local machine. Unlock the accounts that own NFTs (seller) or have Eth on them (buyer)

```
npx ganache --fork https://mainnet.infura.io/v3/<your-infura-key>  --unlock <0x-seller-address> --unlock <buyer-address>
```

- compile the contracts 
```
npx truffle compile
```

- deploy contracts on your mainnet fork:
```
npx truffle migrate --network mainfork
```

- adjust the collection / buyer / seller addresses in our test script according to the accounts you unlocked on your forked chain

```testMarketPlace.js
const azukiNftAddress = "0x-collection-address";
const tokenId = 1234;
const sellerAddress = "0x-seller-address";
const buyerAddress = "0x-buyer-address";
```

- run the test script. It puts the seller's token on sale and will have the buyer account buy it.
```
npx truffle exec scripts/testMarketplace.js --network mainfork
```

sample output for a collection that takes a 5% royalty:

```
owner of 0xed5af388653567af2f388e6224dc7c4b3241c544 #3157 0xDFe0CB7fbC3830C4D413a552A7c707270fD5C72B
Seller Balance (Eth): 0.1776181781880788
owner of 0xed5af388653567af2f388e6224dc7c4b3241c544 #3157 0x5E904A05033D728315dD23Bea210d17A68cA3d19
Seller Balance (Eth): 1.1276181781880788
Seller Balance Diff (Eth): 0.95
```