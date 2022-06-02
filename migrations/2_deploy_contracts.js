var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Whine = artifacts.require("./Whine.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Whine);
};
