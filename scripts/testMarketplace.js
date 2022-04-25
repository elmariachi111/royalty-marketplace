const ClosedDesert = artifacts.require("ClosedDesert");
const IErc721 = require("../build/contracts/IERC721.json");

//change these constants as you like:
const collectionAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544"; // Azuki
const tokenId = 3157;
const sellerAddress = "0xDFe0CB7fbC3830C4D413a552A7c707270fD5C72B";
const buyerAddress = "0x5E904A05033D728315dD23Bea210d17A68cA3d19";

module.exports = async function(callback) {
  try {
    const marketplace = await ClosedDesert.deployed();
    const erc721 = new web3.eth.Contract(IErc721.abi, collectionAddress);
    const salesPrice = web3.utils.toWei("1", "ether");
    
    // marketplace needs the seller's approval to transfer their tokens
    const approval = await erc721.methods.approve(marketplace.address, tokenId).send({from: sellerAddress});
    const sellReceipt = await marketplace.sellNFT(collectionAddress, tokenId, salesPrice, {
      from: sellerAddress
    });
    const { offerHash } = sellReceipt.logs[0].args;
    
    const oldOwner = await erc721.methods.ownerOf(tokenId).call();
    console.log(`owner of ${collectionAddress} #${tokenId}`, oldOwner);
    
    const oldSellerBalance = web3.utils.toBN(await web3.eth.getBalance(sellerAddress));
    console.log("Seller Balance (Eth):", web3.utils.fromWei(oldSellerBalance));

    // buyer buys the item for a sales price of 1 Eth
    const buyReceipt = await marketplace.buyNft(offerHash, {from: buyerAddress, value: salesPrice});
    const newOwner = await erc721.methods.ownerOf(tokenId).call();
    console.log(`owner of ${collectionAddress} #${tokenId}`, newOwner);

    const newSellerBalance = web3.utils.toBN(await web3.eth.getBalance(sellerAddress));
    console.log("Seller Balance (Eth):", web3.utils.fromWei(newSellerBalance));
    console.log("Seller Balance Diff (Eth):", web3.utils.fromWei(newSellerBalance.sub(oldSellerBalance)));

  } catch(e) {
    console.error(e)
  } finally {
    callback();
  }
}
