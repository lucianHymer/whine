const WhineContract = artifacts.require("Whine");

contract("Whine", (accounts) => {
  const [alice, bob] = accounts;

  it("should run", async () => {
    const contractInstance = await WhineContract.new();
    const result = await contractInstance.drinkSomethingEpoch(5, {from: alice});
    assert.equal(result.receipt.status, true);
  });
  
});
