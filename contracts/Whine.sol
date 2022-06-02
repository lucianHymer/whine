pragma solidity >=0.8.0 <0.9.0;

contract Whine {
  uint storedData;

  struct Bottle {
    string name;
    string brand;
    uint id;
    uint16 vintage;
  }

  event Log(uint num);

  Bottle[] public bottles;

  // function getBottle(uint id) public view returns (uint) {
  //   return bottles[id].id;
  // }

  function drinkSomethingEpoch() public {
    emit Log(0);
    bottles.push(Bottle("Veritas", "Epoch", bottles.length, 2021)); 
    emit Log(1);
  }
}
