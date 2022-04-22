# royalty aware marketplace sample

`ClosedDesert` allows users to offer their NFTs for a fixed price. 
Upon purchases the marketplace obeys the collection's royalty rules
and distributes fees accordingly. Uses the general [Royalty Registry](https://royaltyregistry.xyz/)
fee lookup contract on mainnet.

## running

To test against arbitrary NFT collections, this is best tested on a
mainnet fork. Try it out yourself:

- get yourself an [Infura key](https://infura.io) to access blockchain nodes
- start an instant local mainnet fork and unlock some accounts owning NFTs (seller) or having Eth on them (buyer)

```
npx ganache --fork https://mainnet.infura.io/v3/<your-infura-key>  --unlock 0x203eAaCC0un7aDDrE22DFaCC0un7aDDrE22 --unlock 0xan07hErAaCC0un7aDDrE22DFaCC0un7aDDrE22
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
const azukiNftAddress = "0xcollectionaddress";
const sellerAddress = "0x203eAaCC0un7aDDrE22DFaCC0un7aDDrE22";
const buyerAddress = "0xan07hErAaCC0un7aDDrE22DFaCC0un7aDDrE22";
```

- run the test script
```
npx truffle exec scripts/testMarketplace.js --network mainfork
```

sample output:

```
owner of Azuki #3157 0xDFe0CB7fbC3830C4D413a552A7c707270fD5C72B
Seller Balance (Eth): 0.045616186042482216
owner of Azuki #3157 0x5E904A05033D728315dD23Bea210d17A68cA3d19
Seller Balance (Eth): 0.995616186042482216
Seller Balance Diff (Eth): 0.95
```