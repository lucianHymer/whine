const { expect } = require('chai')
const { ethers } = require('hardhat')
const { hash } = require('./helpers.js')

describe('WhineMarket', function () {
  let owner, addr1, addr2, whineMarket, WhineMarket, Whine, whine

  before(async function () {
    ;[owner, addr1, addr2] = await ethers.getSigners()
    Whine = await ethers.getContractFactory('Whine', {
      signer: owner
    })
    WhineMarket = await ethers.getContractFactory('WhineMarket', {
      signer: owner
    })
  })

  beforeEach(async function () {
    whine = await Whine.deploy()
    whineMarket = await WhineMarket.deploy(whine.address, 100, false)
    await whineMarket.deployed()
    await whine.registerMarket(whineMarket.address)
  })

  describe('Winery Approval/Registration', function () {
    it('Should allow winery approval from owner', async function () {
      const name = 'Test Winery'
      await expect(whineMarket.connect(addr1)['registerWinery(string)'](name))
        .to.emit(whineMarket, 'RegisterWinery')
        .withArgs(addr1.address)
      await expect(whineMarket.approveWinery(addr1.address))
        .to.emit(whineMarket, 'ApproveWinery')
        .withArgs(addr1.address)
      expect(await whineMarket.getRegisteredWineryName(addr1.address)).to.equal(
        name
      )
    })

    it('Should reject winery approval from non-owner', async function () {
      await expect(
        whineMarket.connect(addr1)['registerWinery(string)']('Test Winery')
      )
        .to.emit(whineMarket, 'RegisterWinery')
        .withArgs(addr1.address)
      await expect(
        whineMarket.connect(addr1).approveWinery(addr1.address)
      ).to.be.revertedWith('AccessControl')
    })

    it('Should auto-approve winery in demo mode', async function () {
      whineMarket = await WhineMarket.deploy(whine.address, 100, true)
      await whineMarket.deployed()
      await expect(
        whineMarket.connect(addr1)['registerWinery(string)']('Test Winery')
      )
        .to.emit(whineMarket, 'ApproveWinery')
        .withArgs(addr1.address)
    })

    it('Should revert on unregistered', async function () {
      await expect(whineMarket.approveWinery(addr1.address)).to.be.revertedWith(
        'not registered'
      )
    })
  })

  it('Should reject role asignment from non ADMIN', async function () {
    await expect(
      whineMarket.connect(addr1).grantRole(hash('WINERY_ROLE'), addr1.address)
    ).to.be.revertedWith('AccessControl')
  })

  it('Should reject non-owner withdraw', async function () {
    await expect(
      whineMarket.connect(addr2).withdrawFees(addr2.address)
    ).to.be.revertedWith('AccessControl')
  })

  describe('sale', async function () {
    it('Should not allow unapproved sale', async function () {
      await whineMarket.mintNft(addr1.address, '1', 200)
      await expect(
        whineMarket.sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      ).to.be.revertedWith('transfer caller is not owner')
    })

    it('Should allow approved sale from non-holder', async function () {
      await whineMarket.mintNft(addr1.address, '1', 200)
      await whine.connect(addr1).approve(whineMarket.address, 1)
      await expect(
        whineMarket.sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      )
        .to.emit(whine, 'Transfer')
        .withArgs(addr1.address, addr2.address, 1)
    })

    it('Should reject sale with insufficient funds', async function () {
      await whineMarket.mintNft(addr1.address, '1', 200)
      await whine.connect(addr1).approve(whineMarket.address, 1)
      await expect(
        whineMarket.sell(addr1.address, addr2.address, 1, 100)
      ).to.be.revertedWith('Insufficient value sent')
    })

    it('Should issue royalties and fees on sale', async function () {
      await whineMarket.mintNft(addr1.address, '1', 300)
      await whine.connect(addr1).approve(whineMarket.address, 1)
      await expect(
        whineMarket.connect(addr1).sell(addr1.address, addr2.address, 1, 100, {
          value: 100
        })
      )
        .to.emit(whineMarket, 'Payout')
        .withArgs(addr1.address, 1, 3)

      expect(
        await whineMarket.provider.getBalance(whineMarket.address)
      ).to.equal(1)

      const startBalance = await whineMarket.provider.getBalance(addr2.address)
      await expect(whineMarket.withdrawFees(addr2.address))
        .to.emit(whineMarket, 'FeeWithdraw')
        .withArgs(addr2.address)
      const endBalance = await whineMarket.provider.getBalance(addr2.address)
      expect(endBalance.sub(startBalance)).to.equal(1)
    })
  })
})
