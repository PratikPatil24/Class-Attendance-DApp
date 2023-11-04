# CLass Attendance Tracker DApp

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Steps:

## Step 1: Install antd theme package

> npm install antd --save

## Step 2: Install Web3Modal package

> npm i web3modal

## Step 3: Install ethers package (v5.7)

> npm i ethers@5.7

## Step 4: Define Providers in App.js

Before App() define following providers

```
export const providerOptions = {
};
```

## Step 5: Create web3Modal instance

### Step 5.1: Add web3Modal Import

```
import Web3Modal from "web3modal";
```

### Step 5.2: Create Instance in App()

```
const web3Modal = new Web3Modal({
    providerOptions,
  });
```

## Step 6: Create Connect Wallet button

### Step 6.1: Import Button from antd

```
import { Button } from "antd";
```

### Step 6.2: Create new Button in App()

Note: Replace return with following

```
return (
    <div className="App">
      <Button onClick={connectWallet}>Connect Wallet</Button>
    </div>
  );
```

## Step 7: Create connectWallet function in App()

```
import { useState } from "react";
import { ethers } from "ethers";

```

```
const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState();

  const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      setProvider(provider);

      const web3 = new ethers.providers.Web3Provider(provider);
      setWeb3(web3);
    } catch (error) {
      console.error(error);
    }
  };

```

## Step 8: Display Connected Wallet

### Step 8.1: Add Wallet Address Display code in App()

Note: Replace return with following

```
return (
  <div className="App">
    <Button onClick={connectWallet}>
      Connect Wallet
      <div>Connection Status: {account ? `Connected` : `Disconnected`}</div>
      {account && <div>Wallet Address: {account}</div>}
    </Button>
  </div>
);

```

### Step 8.2: Update connectWallet function to find wallet address and network and add 2 states

```

const [account, setAccount] = useState();
const [network, setNetwork] = useState();

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
```

## Step 9: Listen to Wallet events

```
const [chainId, setChainId] = useState();

useEffect(() => {
    if (provider?.on) {
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
```

## Step 10: Add AttendanceTracker Smart Contract Artifact to React

1. Create constants folder in src folder
2. Create a file named AttendanceTracker.json in constants folder
3. Copy the Content of AttendanceTracker artifact file from remix and paste it in the AttendanceTracker.json file

## Step 11: Add Contract Address of Deployed Contract in React

Add following line in App.js and paste your deployed contract address

> const attendanceTrackerContractAddress =
> "<your-contracts-address>";

## Step 12: Define HandleSubmit function which create a instance of contract and sends the transaction

```
const handleSubmit = async (values) => {
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
```

### Step 13: Link the handle submit function in Form on onFinish

```
<Form
  name="wrap"
  labelCol={{ flex: "110px" }}
  labelAlign="left"
  labelWrap
  wrapperCol={{ flex: 1 }}
  colon={false}
  style={{ maxWidth: 600 }}
  onFinish={handleSubmit}
>
...
```
