const ClosedDesert = artifacts.require("ClosedDesert");
const iErc721 = require("../build/contracts/IERC721.json");

const azukiNftAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544";
const sellerAddress = "0xDFe0CB7fbC3830C4D413a552A7c707270fD5C72B";
const buyerAddress = "0x5E904A05033D728315dD23Bea210d17A68cA3d19";

module.exports = async function(callback) {

  try {
    const salesPrice = web3.utils.toWei("1", "ether");
    const marketplace = await ClosedDesert.deployed();

    const azuki = new web3.eth.Contract(iErc721.abi, azukiNftAddress);
    const oldOwner = await azuki.methods.ownerOf(3157).call();
    const approval = await azuki.methods.approve(marketplace.address, 3157).send({from: sellerAddress});
    const sellReceipt = await marketplace.sellNFT(azukiNftAddress, 3157, salesPrice, {
      from: sellerAddress
    });
    const {offerHash} = sellReceipt.logs[0].args;

    const oldSellerBalance = web3.utils.toBN(await web3.eth.getBalance(sellerAddress));
    console.log("owner of Azuki #3157", oldOwner);
    console.log("Seller Balance (Eth):", web3.utils.fromWei(oldSellerBalance));

    const buyReceipt = await marketplace.buyNft(offerHash, {from: buyerAddress, value: salesPrice});
    const newOwner = await azuki.methods.ownerOf(3157).call();
    console.log("owner of Azuki #3157", newOwner);

    const newSellerBalance = web3.utils.toBN(await web3.eth.getBalance(sellerAddress));
    console.log("Seller Balance (Eth):", web3.utils.fromWei(newSellerBalance));
    console.log("Seller Balance Diff (Eth):", web3.utils.fromWei(newSellerBalance.sub(oldSellerBalance)));
  } catch(e) {
    console.error(e)
  } finally {
    callback();
  }
}
