const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { constants } = require("./helpers.js");

describe("Whine", function () {
  let owner, addr1, addr2, whine, Whine;

  before(async function(){
    Whine = await ethers.getContractFactory("Whine");
  });

  beforeEach(async function(){
    whine = await Whine.deploy();
    whine.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should mint multiple tokens", async function () {
    await expect(whine.mintNft(addr1.address, "1")).
      to.emit(whine, 'Transfer').
      withArgs(constants.ZERO_ADDRESS, addr1.address, 1);

    await expect(whine.mintNft(addr2.address, "2")).
      to.emit(whine, 'Transfer').
      withArgs(constants.ZERO_ADDRESS, addr2.address, 2);
  });

  it("Should mint a bottle", async function () {
    await expect(whine.mintBottle(addr1.address)).
      to.emit(whine, 'Transfer').
      withArgs(constants.ZERO_ADDRESS, addr1.address, 1);
    expect(await whine.tokenURI(1)).
      to.include('QmQfsiVaeTnQkesuwnCwmLzhQLP2uRjHJZhVyoqu6jLFWQ');
  });

  it("Should set token URI", async function () {
    await expect(whine.mintNft(addr1.address, "1")).
      to.emit(whine, 'Transfer').
      withArgs(constants.ZERO_ADDRESS, addr1.address, 1);

    expect(await whine.tokenURI(1)).to.equal("1");
  });
});
