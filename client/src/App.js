import React, { Component } from "react";
import Whine from "./contracts/Whine.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { bottle: {}, web3: null, accounts: null, whine: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkWhine = Whine.networks[networkId];
      const whine = new web3.eth.Contract(
        Whine.abi,
        deployedNetworkWhine && deployedNetworkWhine.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, whine }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, whine } = this.state;

    await whine.methods.drinkSomethingEpoch().send({ from: accounts[0] });
    console.log('awaited');

    const bottle = await whine.methods.bottles(0).call();
    this.setState({bottle});
    console.log('Bottle', bottle);
  };

  render() {
    console.log("TEST0");
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>
          <table><tbody>
            <tr><th>ID</th><td>{this.state.bottle && this.state.bottle.id}</td></tr>
            <tr><th>Name</th><td>{this.state.bottle && this.state.bottle.name}</td></tr>
            <tr><th>Brand</th><td>{this.state.bottle && this.state.bottle.brand}</td></tr>
            <tr><th>Vintage</th><td>{this.state.bottle && this.state.bottle.vintage}</td></tr>
          </tbody></table>
        </div>
      </div>
    );
  }
}

export default App;
