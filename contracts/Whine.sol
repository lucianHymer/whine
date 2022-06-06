// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whine is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    constructor() ERC721("Whine NFT", "WHINE") {}

    function mintNft(address to, string memory ipfsKey) public onlyOwner returns (uint256) {
        _tokenId.increment();

        uint256 newNftTokenId = _tokenId.current();
        _safeMint(to, newNftTokenId);
        _setTokenURI(newNftTokenId, ipfsKey);

        return newNftTokenId;
    }

    function mintBottle(address to) external onlyOwner returns (uint256) {
      return mintNft(to, 'https://gateway.pinata.cloud/ipfs/QmQfsiVaeTnQkesuwnCwmLzhQLP2uRjHJZhVyoqu6jLFWQ');
    }

    function _baseURI() pure internal override returns (string memory) {
      return "";
    }
}
