// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract Whine is ERC721URIStorage, AccessControl, ERC2981 {
  /**
   * @dev Emitted when royalties are paid to `to` from the sale of `tokenId`
   */
  event Payout(address indexed to, uint256 indexed tokenId, uint256 amount);

  /**
   * @dev Emitted when fees are withdrawn to `to`.
   */
  event FeeWithdraw(address indexed to);

  /**
   * @dev Emitted when winery requests registration.
   */
  event RegisterWinery(address indexed wallet);

  /**
   * @dev Emitted when winery is approved.
   */
  event ApproveWinery(address indexed wallet);

  using Counters for Counters.Counter;
  Counters.Counter private _tokenId;

  uint96 ownerTakeBasis;

  mapping(address => string) internal registeredWineryName;

  bytes32 public constant WINERY_ROLE = keccak256("WINERY_ROLE");
  bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE");

  constructor(uint96 _ownerTakeBasis) ERC721("Whine NFT", "WHINE") {
    console.log('OWNER', msg.sender);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(WINERY_ROLE, msg.sender);
    _setupRole(TRUSTEE_ROLE, msg.sender);
    // _setDefaultRoyalty(msg.sender, defaultRoyaltyBasis);
    ownerTakeBasis = _ownerTakeBasis;
  }

  function getRegisteredWineryName(address wallet) public view returns (string memory) {
    console.log('getRWN', wallet);
    string memory name = registeredWineryName[wallet];
    console.log('name', name);
    return name;
  }

  function withdrawFees(address payable to) external onlyRole(TRUSTEE_ROLE) {
    to.transfer(address(this).balance);
    emit FeeWithdraw(to);
  }

  function registerWinery(address wallet, string calldata name) public {
    require(bytes(registeredWineryName[wallet]).length == 0, "Winery address already registered");
    console.log('REGISTER', wallet);
    registeredWineryName[wallet] = name;
    emit RegisterWinery(wallet);
  }

  function registerWinery(string calldata name) external {
    registerWinery(msg.sender, name);
  }

  function approveWinery(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(bytes(registeredWineryName[wallet]).length != 0, "Winery not registered");
    grantRole(WINERY_ROLE, wallet);
    console.log('APPROVE', wallet);
    emit ApproveWinery(wallet);
  }

  function mintNft(
    address to,
    string memory ipfsMetadataURI,
    uint96 royaltyBasis
  ) onlyRole(WINERY_ROLE) external returns (uint256) {
    console.log('MINTER', msg.sender);
    _tokenId.increment();

    uint256 newNftTokenId = _tokenId.current();
    _safeMint(to, newNftTokenId);
    _setTokenURI(newNftTokenId, ipfsMetadataURI);
    _setTokenRoyalty(newNftTokenId, msg.sender, royaltyBasis);

    return newNftTokenId;
  }

  function sell(
    address payable from,
    address to,
    uint256 tokenId,
    uint256 salePrice
  ) payable public {
    // Do this first to fail quickly if this is an invalid transfer
    safeTransferFrom(from, to, tokenId);
    require(msg.value >= salePrice, "Must send enough ETH to initiate sale.");

    address royaltyReceiver;
    uint256 payout;

    (royaltyReceiver, payout) = royaltyInfo(tokenId, salePrice);

    uint256 ownerTake = ownerTakeBasis * salePrice / 10000;

    uint256 sellerProfit = salePrice - payout - ownerTake;

    payable(royaltyReceiver).transfer(payout);
    from.transfer(sellerProfit);

    emit Payout(royaltyReceiver, tokenId, payout);
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
