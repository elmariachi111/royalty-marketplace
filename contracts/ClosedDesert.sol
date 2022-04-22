// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/IRoyaltyEngineV1.sol";

struct Offer {
  IERC721 collection;
  uint256 token_id;
  uint256 priceInWei;
}
/**
 * DO NOT USE IN PRODUCTION! 
 * a fixed reserve price marketplace
 */
contract ClosedDesert is ReentrancyGuard {

  mapping(bytes32 => Offer) public offers;

  // https://royaltyregistry.xyz/lookup
  IRoyaltyEngineV1 royaltyEngineMainnet = IRoyaltyEngineV1(0x0385603ab55642cb4Dd5De3aE9e306809991804f);

  event OnSale(bytes32 offerHash, address indexed collection, uint256 token_id, address indexed owner);
  event Bought(address indexed collection, uint256 token_id, address buyer, uint256 price);

  function sellNFT(IERC721 collection, uint256 token_id, uint256 priceInWei) public {
    require(collection.ownerOf(token_id) == msg.sender, "must own the NFT");
    require(collection.getApproved(token_id) == address(this), "must approve the marketplace to sell");

    bytes32 offerHash = keccak256(abi.encodePacked(collection, token_id));
    offers[offerHash] = Offer({
      collection: collection,
      token_id: token_id,
      priceInWei: priceInWei
    });
    emit OnSale(offerHash, address(collection), token_id, msg.sender);
  }

  function buyNft(bytes32 offerHash) public payable nonReentrant {
    Offer memory offer = offers[offerHash];
    require(address(offer.collection) != address(0x0), "no such offer");
    require(msg.value >= offer.priceInWei, "reserve price not met");

    address payable owner = payable(offer.collection.ownerOf(offer.token_id));

    emit Bought(address(offer.collection), offer.token_id, msg.sender, offer.priceInWei);

    // effect: clear offer
    delete offers[offerHash];

    (address payable[] memory recipients, uint256[] memory amounts) = 
      royaltyEngineMainnet.getRoyalty(address(offer.collection), offer.token_id, msg.value);

    uint256 payoutToSeller = offer.priceInWei;
    
    //transfer royalties
    for(uint i = 0; i < recipients.length; i++) {
      payoutToSeller = payoutToSeller - amounts[i];
      Address.sendValue(recipients[i], amounts[i]);
    }
    //transfer remaining sales revenue to seller 
    Address.sendValue(owner, payoutToSeller);

    //finally transfer asset
    offer.collection.safeTransferFrom(owner, msg.sender, offer.token_id);
  }
}