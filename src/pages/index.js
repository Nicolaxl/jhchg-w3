import React, { Component } from "react";
import contractJson from "./abi.json";

import "./index.css"
import "../css/bootstrap.min.css"
import Web3 from "web3";
import {
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap"

import Layout from "../components/layout"
import queryString from "query-string"
import { StaticImage } from "gatsby-plugin-image"



///////////////////////////

const isBrowser = typeof window !== "undefined"
let parsed = "";
if (isBrowser) {
  parsed = queryString.parse(window.location.search)
}
let _ref = "";
let _currentPrice = 0;
let _isActiveOn = "none";
let _isActiveOff = "none";
let _mintReadOnly = true;
let _GetmaxMintAmount =0



const dateTime = Date.now();
const _now = Math.floor(dateTime / 1000);

const rx_live = /^[+-]?\d*(?:\d*)?$/;
const _networkid = 137;
const Switch_networks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  Rinkeby: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/9fe4b651dd214a29a158db8192e0332b"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"]
  }

};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...Switch_networks[networkName]
        }
      ]
    });
  } catch (err) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: `0x${Number(_networkid).toString(16)}`,
        }
      ]
    });


  }
};


class IndexPage extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    MintAmount: "0"
  };


  handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
  };


  connetcWallet = async () => {
    const web3 = new Web3(window.ethereum);

    if (!window.web3) {
      window.alert("請先安裝錢包");
      return;
    }
    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      if (networkId !== _networkid) {
        this.handleNetworkSwitch("polygon")
      }

      const deployedNetwork = contractJson.networks[_networkid];
      const instance = new web3.eth.Contract(
        contractJson.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `無法載入錢包`
      );
      console.error(error);
    }
    const _GetNetworkId = await web3.eth.net.getId();
    this.setState({ GetNetworkId: _GetNetworkId });
  }


  mint = async (event) => {
    const web3 = new Web3(window.ethereum);
    const deployedNetwork = contractJson.networks[_networkid];
    const contract = new web3.eth.Contract(
      contractJson.abi,
      deployedNetwork && deployedNetwork.address
    );
    const accounts = await web3.eth.getAccounts();

    if (typeof parsed.ref == "undefined") {
      _ref = accounts[0];
    } else {
      _ref = parsed.ref;
    }

    if (this.state.MintAmount * this.state.currentPrice > 0) {
      await contract.methods.mint(this.state.MintAmount, _ref).send({
        value: this.state.MintAmount * this.state.currentPrice,
        from: accounts[0],
        _mintAmount: this.state.MintAmount,
        _ref: _ref
      });
      this.setState({ MintAmount: 0 });
    }
  };




  buttonstate = async () => {


    if (window.web3){
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const networkId_window = await web3.eth.net.getId();

    if (typeof accounts[0] === "undefined") {
      this.connetcWallet();

    }
    else if (networkId_window !== _networkid) {
      this.handleNetworkSwitch("polygon")
    }
    else {
      if (this.state.MintAmount === "0") {
        alert("數量不可為0")
      } else {
        this.mint();
      }
    }}else{
      window.open("https://metamask.io/", '_blank').focus();
    }
  }





  componentDidMount = async () => {


    //如果錢包切換，就重新整理頁面
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }


    //如果錢包有連線，使用錢包連線，沒有就使用系統連線

    const provider = new Web3.providers.HttpProvider(
      "https://rpc-mainnet.maticvigil.com"
    );
    let web3 = new Web3(provider);
 

    const deployedNetwork = contractJson.networks[_networkid];
    const contract = new web3.eth.Contract(
      contractJson.abi,
      deployedNetwork && deployedNetwork.address
    );

    if (window.web3){
      const web3_windows = new Web3(window.ethereum);
      const networkId_window = await web3_windows.eth.net.getId();
      const accounts = await web3_windows.eth.getAccounts();
      if (typeof accounts[0] === "undefined") {
        this.setState({ NetWorkState: "登入錢包" });
      }
      else if (networkId_window !== _networkid) {
        this.setState({ NetWorkState: "切換到Polygon" });
      }
      else {
        this.setState({ NetWorkState: "Mint" });
      }
    }else{
      this.setState({ NetWorkState: "請安裝錢包" });
    }
    



    const _roundTime1 = await contract.methods.roundTime(1).call();
    const _roundTime2 = await contract.methods.roundTime(2).call();
    const _roundTime3 = await contract.methods.roundTime(3).call();
    const _roundTime4 = await contract.methods.roundTime(4).call();
    const _roundTime5 = await contract.methods.roundTime(5).call();

    if (_now >= _roundTime5) {
      _currentPrice = await contract.methods.finalCost().call();
    }
    else if (_now >= _roundTime3 && _now <= _roundTime4) {
      _currentPrice = await contract.methods.secondWlCost().call();
    }
    else if (_now >= _roundTime1 && _now <= _roundTime2) {
      _currentPrice = await contract.methods.firstWlCost().call();
    }
    else {
      _currentPrice = 0;
    }

    if (_currentPrice > 0) {
      _isActiveOn = "";
      _isActiveOff = "none";
      _mintReadOnly = false;
    } else {
      _isActiveOn = "none";
      _isActiveOff = "";
      _mintReadOnly = true;
    }

    const _totalSupply = await contract.methods.totalSupply().call();
    const _maxSupply = await contract.methods.maxSupply().call();
    const _maxMintAmount = await contract.methods.maxMintAmount().call();
    this.setState({ totalSupply: _totalSupply });
    this.setState({ maxSupply: _maxSupply });
    _GetmaxMintAmount=_maxMintAmount

  };


  test = async (event) => {
    alert("test");
  };




  handleMintAmountChange = (evt) => {
    if (rx_live.test(evt.target.value)) {
      this.setState({ MintAmount: evt.target.value });
    }
    console.log(_GetmaxMintAmount);
    console.log(evt.target.value);

    if (Number(evt.target.value) > _GetmaxMintAmount) {
      this.setState({ MintAmount:_GetmaxMintAmount });
    }
  };

  //

  render() {

    return (
      <Layout>
        <div
          style={{
            //  backgroundColor: "#80aba9",
          }}
        >
          <div className="section" id="Record">


            <Container>
              <Row xs={1} md={2}>
                <Col>
                  {/* 
                  <video className="is-rounded-10 " width="100%" autoPlay="autoplay" loop={true} muted >
                    <source src="./1649664056117760.mp4" type="video/mp4" /></video> */}

                  <StaticImage
                    src="../images/main.png"
                    className="Imgrounded"
                    width={400}
                    quality={95}
                    formats={["auto", "webp", "avif"]}
                    alt="A Gatsby astronaut"
                    style={{
                      marginBottom: "1.45rem"
                    }}

                  />
                </Col>

                <Col>

                  <div className="section">
                    <div className="content_Text">
                      <div className="mintform">
                        <label><span style={{
                          color: "#D3D761"                        }}>Jinhe</span>{" "}<span style={{ color: "#E55858" }}>不倒翁</span></label><br />



                        <div style={{
                          display: _isActiveOn
                        }}>
                          <label>Mint價格：{_currentPrice / 1e18} {" Matic"}</label><br />

                        </div>
                        <div style={{
                          display: _isActiveOff
                        }}>
                          <span style={{ color: "#D3D761" }}>尚未開放鑄造</span><br />

                        </div>

                        <strong>鑄造數量 </strong>
                        {this.state.totalSupply} / {this.state.maxSupply}
                      </div>

                      <div>
                      </div>
                      <div>
                        <div>
                        </div>
                      </div>
                      <br></br>
                      <label>
                        <input
                          type="textarea"
                          id="MintAmount"
                          maxLength={3}
                          max={20}
                          style={{ width: "100px" }}
                          pattern="[+-]?\d+(?:[.,]\d+)?"
                          onChange={this.handleMintAmountChange}
                          value={this.state.MintAmount}
                          placeholder="Enter amount"
                          className="form-control"
                          readOnly={_mintReadOnly}
                        />
                      </label>

                      <Button
                        type="button"
                        onClick={this.buttonstate}
                        //variant="warning"
                        className="button is-rounded"
                      >
                        {this.state.NetWorkState}
                      </Button>


                    </div>
                  </div></Col>
              </Row>
            </Container>

          </div>
        </div>
      </Layout>
    );
  }
}




export default IndexPage
