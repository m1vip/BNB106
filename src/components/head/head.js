import { getAccount, initContract, onConnect } from "../../web3/eth";
import {formatAddress} from "../../utils/address"
import "./head.css";
const { Component } = require("react");

class Header extends Component {
    constructor(){
        super();
        this.state = {
            isLogin: false,
            account:""
        }
    }

    onConnectWallet = async () => {
        await onConnect();
        this.setState({
            isLogin: true
        })
    }

    componentDidMount = async () => {
        await onConnect();
        await initContract()
        const account = await getAccount();
        this.setState({
            account:account,
            isLogin: account ? true : false
        })
    }

    render() {
        let {isLogin, account} = this.state;
        return <div className="header">
            <div className="title">
                <img src="./assets/images/logo.gif"/>
                <span>BNB 1.06</span>
            </div>
            <div className="account">
                {
                    isLogin ? <span>{formatAddress(account)}</span>:<button type="" onClick={this.onConnectWallet}>连接钱包</button>
                }
            </div>
        </div>
    }
}

export default Header;