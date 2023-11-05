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

  const [classAttendance, setClassAttendance] = useState([]);

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

  const getClassAttendance = async (values) => {
    try {
      const signer = web3.getSigner();
      const attendanceTrackerContract = new ethers.Contract(
        attendanceTrackerContractAddress,
        AttendanceTrackerArtifact.abi,
        signer
      );

      const classDataFromContract = await attendanceTrackerContract.classes(
        values.classId
      );

      const classData = {};
      classData.id = classDataFromContract[0].toNumber();
      classData.name = classDataFromContract[1];
      classData.at = classDataFromContract[2].toNumber();
      classData.noOfStudents = classDataFromContract[3].toNumber();
      console.log(classData);

      const classAttendance = [];
      for (let i = 1; i <= classData.noOfStudents; i++) {
        const attendance = await attendanceTrackerContract.getAttendance(
          values.classId,
          i
        );
        console.log(attendance);
        classAttendance.push({ rollNo: i, attendance });
      }
      console.log(classAttendance);
      setClassAttendance(classAttendance);
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
                  name="addNewClass"
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
                  name="markAttendance"
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

      <Row justify={"center"} style={{ marginTop: "80px" }}>
        <Col span={16}>
          {account && network && (
            <div style={{ margin: "20px" }}>
              <Card title="Get Attendance">
                <Form
                  name="getAttendance"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                  style={{ maxWidth: 600 }}
                  onFinish={getClassAttendance}
                >
                  <Form.Item
                    label="Class Id"
                    name="classId"
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

      <Row justify="center" style={{ marginTop: "40px" }}>
        <Col span={16}>
          {account && classAttendance.length > 0 && (
            <Row>
              <h3>Class Attendance</h3>
              <Col
                span={22}
                style={{ border: "1px solid #ccc", padding: "10px" }}
              >
                {classAttendance.map((student) => (
                  <p key={student.rollNo}>
                    {`Roll No: ${student.rollNo} Attendance: ${
                      student.attendance ? "Present" : "Absent"
                    }`}
                  </p>
                ))}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
