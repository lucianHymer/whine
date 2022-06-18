# WHINE
WHINE is an NFT token representing a single bottle of wine.

The code here provides:
- The customized ERC721 token contract
- A client-side application for minting, trading, and redeeming
token
- A NodeJS server-side application to handle
steps in the minting process which require privary

Winery owners can mint WHINE tokens and distribute them at an
initial sale price.

Trades on the WHINE platform will pay rolyalties to the minter.
There is a plan to discourage off-platform trading by requiring a tax 
for redemption when off-platform trading is detected.

Because of the rolyalties on each trade, wineries make
more money if there is more buzz or **"whine"** around their wine.

Once a user has enough bottles for a *case* with a particular winery,
     they can redeem those bottles with free shipment to a provided address.

Wineries will be certified with a reputation system.

Server-side requests are authenticated with a pattern similar to
SIWE, but I didn't realize SIWE existed when I wrote it. This will 
be rewritten to be exactly in-line with the spec eventually.

The only server-side request right now is to pin the IPFS metadata
which needed to be server-side to secure Pinata credentials.

# Structure
- The Solidity contracts are in `/contracts`, and the contract tests in `/tests`.
- All client-side code is in `/client`.
- All NodeJS code is in `/server`.

# Tools
### Smart Contract/Blockchain
- Solidity
- Hardhat
- Ethers.js
- OpenZeppelin ERC721, ERC2981 (Royalties), AccessControl
### Client Application
- React (Hooks)
- Chakra UI
- React Router
- Ethers.js
### Server Application
- NodeJS

