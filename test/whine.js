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

  it('Should support ERC721 Interface', async function () {
    const ERC721InterfaceID = '0x80ac58cd'
    expect(await whine.supportsInterface(ERC721InterfaceID)).to.equal(true)
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

  describe('Winery Approval/Registration', function () {
    it('Should allow winery approval from owner', async function () {
      const name = 'Test Winery'
      await expect(whine.connect(addr1)['registerWinery(string)'](name))
        .to.emit(whine, 'RegisterWinery')
        .withArgs(addr1.address)
      await expect(whine.approveWinery(addr1.address))
        .to.emit(whine, 'ApproveWinery')
        .withArgs(addr1.address)
      expect(await whine.getRegisteredWineryName(addr1.address)).to.equal(name)
    })

    it('Should reject approval from non-owner', async function () {
      await expect(
        whine.connect(addr1)['registerWinery(string)']('Test Winery')
      )
        .to.emit(whine, 'RegisterWinery')
        .withArgs(addr1.address)
      await expect(
        whine.connect(addr1).approveWinery(addr1.address)
      ).to.be.revertedWith('AccessControl')
    })

    it('Should auto-approve in demo mode', async function () {
      whine = await Whine.deploy(100, true)
      await whine.deployed()
      await expect(
        whine.connect(addr1)['registerWinery(string)']('Test Winery')
      )
        .to.emit(whine, 'ApproveWinery')
        .withArgs(addr1.address)
    })

    it('Should revert on unregistered', async function () {
      await expect(whine.approveWinery(addr1.address)).to.be.revertedWith(
        'not registered'
      )
    })
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

  it('Should reject non-owner withdraw', async function () {
    await expect(
      whine.connect(addr2).withdrawFees(addr2.address)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should set royalties on mint', async function () {
    await whine.mintNft(addr1.address, '1', 200)
    const [addr, payout] = await whine.royaltyInfo(1, 100)
    expect(addr).to.equal(owner.address)
    expect(payout).to.equal(2)
  })

  describe('sale', async function () {
    it('Should not allow unapproved sale', async function () {
      await whine.mintNft(addr1.address, '1', 200)
      await expect(
        whine.sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      ).to.be.revertedWith('transfer caller is not owner')
    })

    it('Should allow approved sale from non-holder', async function () {
      await whine.mintNft(addr1.address, '1', 200)
      await whine.connect(addr1).approve(owner.address, 1)
      await expect(
        whine.sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      )
        .to.emit(whine, 'Transfer')
        .withArgs(addr1.address, addr2.address, 1)
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
      await expect(
        whine.connect(addr1).sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      )
        .to.emit(whine, 'Payout')
        .withArgs(owner.address, 1, 3)

      expect(await whine.provider.getBalance(whine.address)).to.equal(1)

      const startBalance = await whine.provider.getBalance(addr2.address)
      await expect(whine.withdrawFees(addr2.address))
        .to.emit(whine, 'FeeWithdraw')
        .withArgs(addr2.address)
      const endBalance = await whine.provider.getBalance(addr2.address)
      expect(endBalance.sub(startBalance)).to.equal(1)
    })
  })
})
