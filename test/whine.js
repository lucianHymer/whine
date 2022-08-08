const { expect } = require('chai')
const { ethers } = require('hardhat')
const { constants, hash } = require('./helpers.js')

describe('Whine', function () {
  let owner, addr1, addr2, whine, Whine

  before(async function () {
    ;[owner, addr1, addr2] = await ethers.getSigners()
    Whine = await ethers.getContractFactory('Whine', { signer: owner })
  })

  beforeEach(async function () {
    whine = await Whine.deploy()
    whine.deployed()
  })

  it('Should support ERC721 Interface', async function () {
    const ERC721InterfaceID = '0x80ac58cd'
    expect(await whine.supportsInterface(ERC721InterfaceID)).to.equal(true)
  })

  it('Should support AccessControl Interface', async function () {
    const interfaceID = '0x7965db0b'
    expect(await whine.supportsInterface(interfaceID)).to.equal(true)
  })

  it('Should approve multiple tokens', async function () {
    ;['1', '2'].map(async metadataURI => {
      await whine.mintNft(owner.address, metadataURI, 200)
    })
    await expect(whine.approveMultiple(addr2.address, [1, 2]))
      .to.emit(whine, 'Approval')
      .withArgs(owner.address, addr2.address, 1)
      .withArgs(owner.address, addr2.address, 2)
  })

  it('Should mint multiple tokens', async function () {
    await expect(whine.mintNft(addr1.address, '1', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr1.address, 1)

    await expect(whine.mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 2)
  })

  it('Should reject mint from non MARKET_ROLE', async function () {
    await expect(
      whine.connect(addr1).mintNft(addr2.address, '2', 200)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should accept mint from MARKET_ROLE', async function () {
    await whine.grantRole(hash('MARKET_ROLE'), addr1.address)
    await expect(whine.connect(addr1).mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)
  })

  it('Should assign royalty to mint receiver', async function () {
    await whine.grantRole(hash('MARKET_ROLE'), addr1.address)
    await expect(whine.connect(addr1).mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)
    const [royaltyReceiver, royaltyValue] = await whine.royaltyInfo(1, 1000)
    expect(royaltyReceiver).to.equal(addr2.address)
    expect(royaltyValue).to.equal(20)
  })

  it('Should reject role asignment from non ADMIN', async function () {
    await expect(
      whine.connect(addr1).grantRole(hash('MARKET_ROLE'), addr1.address)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should reject approval from non-owner', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    await expect(whine.approve(owner.address, 1)).to.be.revertedWith(
      'approve caller is not owner'
    )
  })

  it('Should set token URI', async function () {
    await expect(whine.mintNft(addr2.address, '1', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)

    expect(await whine.tokenURI(1)).to.equal('ipfs://1')
  })

  it('Should set royalties on mint', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    const [addr, payout] = await whine.royaltyInfo(1, 100)
    expect(addr).to.equal(addr1.address)
    expect(payout).to.equal(2)
  })

  it('Should reset royalties on burn', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    await whine.connect(addr1).burn(1)
    const [addr, payout] = await whine.royaltyInfo(1, 100)
    // default royalties
    expect(addr).to.equal(owner.address)
    expect(payout).to.equal(1)
  })

  it('Should rejectr burn from non-holder', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    await expect(whine.burn(1)).to.be.revertedWith('Not the token holder')
  })
})
