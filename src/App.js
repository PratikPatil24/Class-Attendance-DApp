import { useEffect, useState } from "react";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Button } from "antd";

export const providerOptions = {
  // walletconnect: {
  //   package: WalletConnect,
  //   options: {
  //     infuraId: process.env.INFURA_KEY,
  //   },
  // },
};

function App() {
  const web3Modal = new Web3Modal({
    providerOptions,
  });

  const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState();

  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();
  const [chainId, setChainId] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      setProvider(provider);

      const web3 = new ethers.providers.Web3Provider(provider);
      setWeb3(web3);

      const accounts = await web3.listAccounts();
      if (accounts) {
        setAccount(accounts[0]);
      }

      const network = await web3.getNetwork();
      setNetwork(network);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts);
      };

      const handleChainChanged = (chainId) => {
        setChainId(chainId);
      };

      const handleDisconnect = () => {
        setAccount(null);
        setNetwork(null);
        setChainId(null);
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <div className="App">
      <Button onClick={connectWallet}>
        Connect Wallet
        <div>Connection Status: {account ? `Connected` : `Disconnected`}</div>
        {account && <div>Wallet Address: {account}</div>}
        {network && <div>Network: {network.name}</div>}
      </Button>
    </div>
  );
}

export default App;
