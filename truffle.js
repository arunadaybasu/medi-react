var HDWalletProvider = require("truffle-hdwallet-provider");
// /https://github.com/trufflesuite/truffle-hdwallet-provider

var mnemonic = "eternal route width abandon army help error vibrant inhale wolf lava plastic";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby1: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0xD8f647855876549d2623f52126CE40D053a2ef6A", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/I02RmFrxSUKZOhXjBtip")
      },
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/qnsgaxThQrJ0VmUJZKQy")
      },
      network_id: 3,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};
