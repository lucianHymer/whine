// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Whine = await hre.ethers.getContractFactory("Whine");
  const whine = await Whine.deploy(100);

  await whine.deployed();

  const chainId = whine.provider._network.chainId;
  const { address } = whine;
  const content = JSON.stringify({ networks: {
    [chainId]: {address}
  }});

  const path = './artifacts/contracts/Whine.sol/network.json';
  fs.writeFileSync(path, content, err => {
    if(err) console.log(err);
  });

  const signer = whine.signer.address;
  console.log('signer', signer);

  await whine['registerWinery(address,string)'](signer, "Lucian's Whines");
  await whine.approveWinery(signer);

  console.log(`Wrote ${content} to ${path}`);

  console.log("Whine deployed to:", whine.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
