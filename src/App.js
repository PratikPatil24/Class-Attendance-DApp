import { useEffect, useState } from "react";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Layout, Row, Col, Button, Card, Form, Input, Select } from "antd";
import AttendanceTrackerArtifact from "./constants/AttendanceTracker.json";

export const providerOptions = {};

const attendanceTrackerContractAddress =
  "0x0314725e4b0d948D93d33738c3e0aeb38F776dAD";

function App() {
  const { Option } = Select;

  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);

  const web3Modal = new Web3Modal({ providerOptions });

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      setProvider(provider);

      const web3 = new ethers.providers.Web3Provider(provider);
      setWeb3(web3);

      const accounts = await web3.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const network = await web3.getNetwork();
      setNetwork(network);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (provider) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
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

  const handleAddNewClass = async (values) => {
    try {
      const signer = web3.getSigner();
      const attendanceTrackerContract = new ethers.Contract(
        attendanceTrackerContractAddress,
        AttendanceTrackerArtifact.abi,
        signer
      );

      await attendanceTrackerContract.addClass(
        values.id,
        values.name,
        values.at,
        values.noOfStudents
      );
    } catch (error) {
      console.error(error);
    }
  };

  const [form] = Form.useForm();

  const onAttendanceChange = (value) => {
    switch (value) {
      case "present":
        form.setFieldsValue({ attendance: true });
        break;
      case "absent":
        form.setFieldsValue({ attendance: false });
        break;
      default:
    }
  };

  const handleMarkAttendance = async (values) => {
    try {
      const signer = web3.getSigner();
      const attendanceTrackerContract = new ethers.Contract(
        attendanceTrackerContractAddress,
        AttendanceTrackerArtifact.abi,
        signer
      );

      await attendanceTrackerContract.markAttendance(
        values.classId,
        values.rollNo,
        values.attendance
      );
    } catch (error) {
      console.error(error);
    }
  };

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
                  onFinish={handleAddNewClass}
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

      <Row justify={"center"} style={{ marginTop: "80px" }}>
        <Col span={16}>
          {account && network && (
            <div style={{ margin: "20px" }}>
              <Card title="Mark Attendance">
                <Form
                  name="wrap"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                  style={{ maxWidth: 600 }}
                  onFinish={handleMarkAttendance}
                >
                  <Form.Item
                    label="Class Id"
                    name="classId"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Roll No"
                    name="rollNo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="attendance"
                    label="Attendance"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select a option and change input text above"
                      onChange={onAttendanceChange}
                      allowClear
                    >
                      <Option value={true}>Present</Option>
                      <Option value={false}>Absent</Option>
                    </Select>
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
