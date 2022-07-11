// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./IWhine.sol";

contract Whine is IWhine, ERC721URIStorage, AccessControl, ERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;


    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");

    constructor() ERC721("Whine NFT", "WHINE") {
        console.log("OWNER", msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setDefaultRoyalty(msg.sender, 100);
        _setupRole(MARKET_ROLE, msg.sender);
    }

    modifier onlyHolder(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the token holder");
        _;
    }

    function registerMarket(address contractAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(MARKET_ROLE, contractAddress);
    }

    function mintNft(
        address to,
        string memory ipfsMetadataURI,
        uint96 royaltyBasis
    ) external onlyRole(MARKET_ROLE) override returns (uint256) {
        console.log("MINTER", msg.sender);
        _tokenId.increment();

        uint256 newNftTokenId = _tokenId.current();
        _safeMint(to, newNftTokenId);
        _setTokenURI(newNftTokenId, ipfsMetadataURI);
        _setTokenRoyalty(newNftTokenId, to, royaltyBasis);

        return newNftTokenId;
    }

    function approveMultiple(address to, uint256[] calldata tokenIds) public override {
        for(uint i = 0; i<tokenIds.length; i++){
            approve(to, tokenIds[i]);
        }
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl, ERC2981, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {ERC721-_burn}. This override additionally clears the royalty information for the token.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    function burn(uint256 tokenId) public override onlyHolder(tokenId){
        _burn(tokenId);
    }
}
