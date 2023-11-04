import { useEffect, useState } from "react";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Layout, Row, Col, Button, Card, Form, Input } from "antd";

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
    <Layout>
      <Row justify={"center"} style={{ marginTop: "80px" }}>
        <Col>
          <Button onClick={connectWallet}>
            Connect Wallet
            <div>
              Connection Status: {account ? `Connected` : `Disconnected`}
            </div>
            <div>
              {account && <div>Wallet Address: {account}</div>}
              {network && <div>Network: {network.name}</div>}
            </div>
          </Button>
        </Col>
      </Row>

      <Row justify={"center"} style={{ marginTop: "80px" }}>
        <Col span={16}>
          {account && network && (
            <div style={{ margin: "20px" }}>
              <Card title="Add New Class">
                <Form
                  name="wrap"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                  style={{ maxWidth: 600 }}
                  onFinish={(values) => {
                    console.log(values);
                  }}
                >
                  <Form.Item label="Id" name="id" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Time"
                    name="at"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="No Of Students"
                    name="noOfStudents"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="">
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
