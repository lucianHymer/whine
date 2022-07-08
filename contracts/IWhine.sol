// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IWhine is IAccessControl, IERC2981, IERC721Metadata {

    function mintNft(
        address to,
        string memory ipfsMetadataURI,
        uint96 royaltyBasis
    ) external returns (uint256);

    function approveMultiple(address to, uint256[] calldata tokenIds) external;

    function burn(uint256 tokenId) external;
}
