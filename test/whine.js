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
    whine = await Whine.deploy(100, false)
    whine.deployed()
  })

  it('Should mint multiple tokens', async function () {
    await expect(whine.mintNft(addr1.address, '1', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr1.address, 1)

    await expect(whine.mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 2)
  })

  it('Should reject mint from non WINERY_ROLE', async function () {
    await expect(
      whine.connect(addr1).mintNft(addr2.address, '2', 200)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should accept mint from WINERY_ROLE', async function () {
    await whine.grantRole(hash('WINERY_ROLE'), addr1.address)
    await expect(whine.connect(addr1).mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)
  })

  it('Should assign royalty to minter', async function () {
    await whine.grantRole(hash('WINERY_ROLE'), addr1.address)
    await expect(whine.connect(addr1).mintNft(addr2.address, '2', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)
    const [royaltyReceiver, royaltyValue] = await whine.royaltyInfo(1, 1000)
    expect(royaltyReceiver).to.equal(addr1.address)
    expect(royaltyValue).to.equal(20)
  })

  it('Should reject role asignment from non ADMIN', async function () {
    await expect(
      whine.connect(addr1).grantRole(hash('WINERY_ROLE'), addr1.address)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should set token URI', async function () {
    await expect(whine.mintNft(addr2.address, '1', 200))
      .to.emit(whine, 'Transfer')
      .withArgs(constants.ZERO_ADDRESS, addr2.address, 1)

    expect(await whine.tokenURI(1)).to.equal('ipfs://1')
  })

  it('Should not allow unapproved sale', async function () {
    // await expect(whine.mintNft(addr1.address, "1", 200)).
    //   to.emit(whine, 'Transfer').
    //   withArgs(constants.ZERO_ADDRESS, addr1.address, 1);
  })

  it('Should reject approval from non-owner', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    await expect(whine.approve(owner.address, 1)).to.be.revertedWith(
      'approve caller is not owner'
    )
  })

  it('Should reject sale with insufficient funds', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    await whine.connect(addr1).approve(owner.address, 1)
    await expect(
      whine.sell(addr1.address, addr2.address, 1, 100)
    ).to.be.revertedWith('Insufficient value sent')
  })

  it('Should issue royalties and fees on sale', async function () {
    await whine.mintNft(addr1.address, '1', 300)
    await whine.connect(addr1).approve(owner.address, 1)
    await expect(
      whine.sell(addr1.address, addr2.address, 1, 100, {
        value: 100
      })
    )
      .to.emit(whine, 'Payout')
      .withArgs(owner.address, 1, 3)

    expect(await whine.provider.getBalance(whine.address)).to.equal(1)
  })
})
