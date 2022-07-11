const { ethers } = require('hardhat')

module.exports = {
  constants: {
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000'
  },
  hash: str => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str))
}
