// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract Whine is ERC721URIStorage, AccessControl, ERC2981 {
  /**
   * @dev Emitted when royalties are paid to `to` from the sale of `tokenId`
   */
  event Payout(address indexed to, uint256 indexed tokenId, uint256 amount, uint256 ownerTake);

  using Counters for Counters.Counter;
  Counters.Counter private _tokenId;

  bytes32 public constant WINERY_ROLE = keccak256("WINERY_ROLE");
  bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE");

  constructor() ERC721("Whine NFT", "WHINE") {
    console.log('OWNER', msg.sender);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(WINERY_ROLE, msg.sender);
    _setupRole(TRUSTEE_ROLE, msg.sender);
    _setDefaultRoyalty(msg.sender, 100);
  }

  function mintNft(address to, string memory ipfsMetadataURI) onlyRole(WINERY_ROLE) external returns (uint256) {
    console.log('MINTER', msg.sender);
    _tokenId.increment();

    uint256 newNftTokenId = _tokenId.current();
    _safeMint(to, newNftTokenId);
    _setTokenURI(newNftTokenId, ipfsMetadataURI);
    _setTokenRoyalty(newNftTokenId, msg.sender, 200);

    return newNftTokenId;
  }

  function approveTreasury(uint256 tokenId){
  }

  function sendAndPayRoyalties(address to, uint256 tokenId, uint256 salePrice) payable public onlyRole(TRUSTEE_ROLE) returns (address, uint256, uint256) {
    address from = ownerOf(tokenId);
    address royaltyReceiver;
    uint256 payout;

    (royaltyReceiver, payout) = royaltyInfo(tokenId, salePrice);

    uint256 ownerTake = payout / 100;

    payout = payout - ownerTake;

    safeTransferFrom(from, to, tokenId);

    address payable owner = address(uint160(getRoleAdmin(DEFAULT_ADMIN_ROLE)));
    emit Payout(royaltyReceiver, tokenId, payout, ownerTake);
  }

  function _baseURI() pure internal override returns (string memory) {
    return "ipfs://";
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {ERC721-_burn}. This override additionally clears the royalty information for the token.
   */
  function _burn(uint256 tokenId) internal virtual override {
    super._burn(tokenId);
    _resetTokenRoyalty(tokenId);
  }
}
