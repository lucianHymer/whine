// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IWhine.sol";
import "hardhat/console.sol";

contract WhineMarket is AccessControl {
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

    uint96 private ownerTakeBasis;

    bool private demo;

    IWhine private tokenContract;

    mapping(address => string) internal registeredWineryName;

    bytes32 public constant WINERY_ROLE = keccak256("WINERY_ROLE");
    bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE");

    constructor(address tokenContractAddress, uint96 _ownerTakeBasis, bool _demo) {
        console.log("OWNER", msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(WINERY_ROLE, msg.sender);
        _setupRole(TRUSTEE_ROLE, msg.sender);
        ownerTakeBasis = _ownerTakeBasis;
        demo = _demo;
        tokenContract = IWhine(tokenContractAddress);
    }

    modifier onlyRoleDemoExcluded(bytes32 role) {
        if(!demo)
            _checkRole(role);
        _;
    }

    function getRegisteredWineryName(address wallet) public view returns (string memory) {
        console.log("getRWN", wallet);
        string memory name = registeredWineryName[wallet];
        console.log("name", name);
        return name;
    }

    function withdrawFees(address payable to) external onlyRole(TRUSTEE_ROLE) {
        to.transfer(address(this).balance);
        emit FeeWithdraw(to);
    }

    function registerWinery(address wallet, string calldata name) public {
        // TODO uncomment after testing
        // require(bytes(registeredWineryName[wallet]).length == 0, "Winery address already registered");
        console.log("REGISTER", wallet);
        registeredWineryName[wallet] = name;
        emit RegisterWinery(wallet);
        if(demo) {
            approveWinery(wallet);
        }
    }

    function mintNft(
        address to,
        string memory ipfsMetadataURI,
        uint96 royaltyBasis
    ) external onlyRole(WINERY_ROLE) returns (uint256) {
        return tokenContract.mintNft(to, ipfsMetadataURI, royaltyBasis);
    }

    function registerWinery(string calldata name) external {
        registerWinery(msg.sender, name);
    }

    function approveWinery(address wallet) public onlyRoleDemoExcluded(DEFAULT_ADMIN_ROLE) {
        require(bytes(registeredWineryName[wallet]).length != 0, "Winery not registered");
        if(demo) {
            _grantRole(WINERY_ROLE, wallet);
        } else {
            grantRole(WINERY_ROLE, wallet);
        }

        console.log("APPROVE", wallet);
        emit ApproveWinery(wallet);
    }

    // function approveMultiple(address to, uint256[] calldata tokenIds) public {
    //     for(uint i = 0; i<tokenIds.length; i++){
    //         approve(to, tokenIds[i]);
    //     }
    // }

    function sell(
        address payable from,
        address to,
        uint256 tokenId,
        uint256 salePrice
    ) public payable {
        // Do this first to fail quickly if this is an invalid transfer
        tokenContract.safeTransferFrom(from, to, tokenId);
        require(msg.value >= salePrice, "Insufficient value sent");

        address royaltyReceiver;
        uint256 payout;

        (royaltyReceiver, payout) = tokenContract.royaltyInfo(tokenId, salePrice);

        uint256 ownerTake = ownerTakeBasis * salePrice / 10000;

        uint256 sellerProfit = salePrice - payout - ownerTake;

        payable(royaltyReceiver).transfer(payout);
        from.transfer(sellerProfit);

        emit Payout(royaltyReceiver, tokenId, payout);
    }

    receive() external payable {}
}
