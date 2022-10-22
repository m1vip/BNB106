import { ethers, utils } from "ethers";
import { formatAddress, getQueryVariable } from "../../utils/address";
import { formatNumberToHours } from "../../utils/date";
import { BP106, BP106Proxy, getAccount, initContract, PlatformAddressContract, provider } from "../../web3/eth";
import { Button, message, Modal, Spin } from 'antd';
import "./main.css";
import Clipboard from 'clipboard';
import { EXPOLER } from "../../config";
import { PlatformAddress } from "../../web3/address";
const { Component } = require("react");

const copy = new Clipboard('.copy_btn');
class Main extends Component {
    constructor() {
        super();
        this.state = {
            totalIncome: 0,
            platform1AmountWithdraw: 0,
            platform2AmountWithdraw: 0,
            platform3AmountWithdraw: 0,
            platform4AmountWithdraw: 0,
            platform5AmountWithdraw: 0,
            platformBalance: 0,
            platformAddress1Amount: 0,
            platformAddress2Amount: 0,
            platformAddress3Amount: 0,
            platformAddress4Amount: 0,
            platformAddress5Amount: 0,
            platform1Address: "",
            platform2Address: "",
            platform3Address: "",
            platform4Address: "",
            platform5Address: "",
            isSpinning: true,
            account: "",
            user: null,
            userReward: null,
            coutdownObj: {
                hours: "00",
                minutes: "00",
                seconds: "00"
            },
            usersOfReferrer: [],
            inviter: "",
            totalId: 0,
            rewardUserId: 0,
            isModalOpen: false,
            members: [],
            poolBalance: 0,
            serialNumber: 0,
            sameLevelBoss: [],
            modalTitle: "",
            isOwner: false,
            owner: "",
            vipAddress: "",
            ownerAddress: "",
            firstAddress: "",
            identityOfUser: 0,
            serialNumberOfUser: 0,
            directAmount: 0,
            seePointAmount: 0,
            bossAmount: 0,
            poolAmount: 0,
            serialNumberOfUser_pool: 0,
            countUsersOfReferrer: 0,
            second_collapse: false,
            thrid_collapse: false,
            fourth_collapse: false
        }
    }

    getAccountInfo = async (account) => {
        // inviter
        let inviter = getQueryVariable("inviter")

        let serialNumberOfUser = await BP106Proxy.serialNumberOfUser(account);

        if (serialNumberOfUser / 1 != 0) {
            let joinTime = await BP106Proxy.userJoinTime(account);
            let hours168 = await BP106Proxy.hours168();

            let restTime = (joinTime / 1) + (hours168 / 1);

            setInterval(() => {
                let now = Math.floor(new Date().getTime() / 1000);
                let coutdownObj = formatNumberToHours(restTime - now);
                this.setState({
                    coutdownObj
                })
            }, 1000)
            let identityOfUser = await BP106Proxy.identityOfUser(account);


            this.setState({
                serialNumberOfUser,
                identityOfUser,
            })
        }

        // next reward user id
        let totalId = await BP106Proxy.serialNumber();
        this.setState({
            totalId,
        })
        let firstAddress = await BP106Proxy.firstAddress();

        let serialNumber = await BP106Proxy.serialNumber();
        let poolCurAmount = await BP106Proxy.poolCurAmount();

        let poolLastRewardUser = await BP106Proxy.poolLastRewardUser();
        // let poolList = lengthPoolList / 1 == 0 ? "0x" + "0".repeat(40) : await BP106Proxy.poolList(poolIndex / 1);

        let serialNumberOfUser_pool = await BP106Proxy.serialNumberOfUser(poolLastRewardUser);

        const owner = await BP106Proxy.owner();
        if (owner.toLocaleLowerCase() == account.toLocaleLowerCase()) {
            this.setState({
                owner,
                isOwner: true
            })
        } else {
            this.setState({
                owner,
                isOwner: false
            })
        }

        const platform1Address = await PlatformAddressContract.platform1();
        const platform2Address = await PlatformAddressContract.platform2();
        const platform3Address = await PlatformAddressContract.platform3();
        const platform4Address = await PlatformAddressContract.platform4();
        const platform5Address = await PlatformAddressContract.platform5();
        this.setState({
            platform1Address,
            platform2Address,
            platform3Address,
            platform4Address,
            platform5Address,
        })

        if (account.toLocaleLowerCase() == platform1Address.toLocaleLowerCase() ||
            account.toLocaleLowerCase() == platform2Address.toLocaleLowerCase() ||
            account.toLocaleLowerCase() == platform3Address.toLocaleLowerCase() ||
            account.toLocaleLowerCase() == platform4Address.toLocaleLowerCase() ||
            account.toLocaleLowerCase() == platform5Address.toLocaleLowerCase()) {

            switch (account.toLocaleLowerCase()) {
                case platform1Address.toLocaleLowerCase():
                    const platformAddress1Amount = await PlatformAddressContract.platform1Amount();
                    const platform1AmountWithdraw = await PlatformAddressContract.platform1AmountWithdraw();

                    this.setState({
                        platformAddress1Amount,
                        platform1AmountWithdraw
                    })
                    break;
                case platform2Address.toLocaleLowerCase():
                    const platformAddress2Amount = await PlatformAddressContract.platform2Amount();
                    const platform2AmountWithdraw = await PlatformAddressContract.platform2AmountWithdraw();
                    this.setState({
                        platformAddress2Amount,
                        platform2AmountWithdraw
                    })
                    break;
                case platform3Address.toLocaleLowerCase():
                    const platformAddress3Amount = await PlatformAddressContract.platform3Amount();
                    const platform3AmountWithdraw = await PlatformAddressContract.platform3AmountWithdraw();
                    this.setState({
                        platformAddress3Amount,
                        platform3AmountWithdraw
                    })
                    break;
                case platform4Address.toLocaleLowerCase():
                    const platformAddress4Amount = await PlatformAddressContract.platform4Amount();
                    const platform4AmountWithdraw = await PlatformAddressContract.platform4AmountWithdraw();
                    this.setState({
                        platformAddress4Amount,
                        platform4AmountWithdraw
                    })
                    break;
                case platform5Address.toLocaleLowerCase():
                    const platformAddress5Amount = await PlatformAddressContract.platform5Amount();
                    const platform5AmountWithdraw = await PlatformAddressContract.platform5AmountWithdraw();
                    this.setState({
                        platformAddress5Amount,
                        platform5AmountWithdraw
                    })
                    break;
            }

            const platformBalance = await provider.getBalance(PlatformAddress);

            const totalIncome = await PlatformAddressContract.totalIncome();

            this.setState({
                platformBalance,
                totalIncome
            })
        }



        this.setState({
            serialNumberOfUser: serialNumberOfUser,
            serialNumber,
            inviter,
            firstAddress,
            poolBalance: poolCurAmount,
            serialNumberOfUser_pool,
            isSpinning: false,
        })
    }

    showBoss = async (account) => {
        let userJoinTime = await BP106Proxy.userJoinTime(account.account);
        account.userJoinTime = userJoinTime / 1;
        this.setState({
            modalTitle: "成员",
            isModalOpen: true,
            members: [account]
        })

    }

    cpLink = async () => {
        copy.on('success', e => {
            message.success("复制成功")
        });
        copy.on('error', function (e) {
            message.error("复制失败")
        });
    }

    deposit = async () => {
        let { inviter, firstAddress } = this.state;
        if (firstAddress == "0x" + "0".repeat(40)) {
            message.error("请先初始化数据");
            return;
        }
        message.loading({ content: '参与中...', key: "deposit", duration: 0 });
        await BP106Proxy.join(inviter == "" || !inviter ? firstAddress : inviter, { value: utils.parseEther("1.06") })
            .then(async (ret) => {
                await ret.wait().then(async (res) => {
                    console.log(res);
                    // await this.getAccountInfo(this.account);
                    window.location.reload();
                }).catch((err) => {
                    console.log(err);
                    if (err.toString().includes("Already deposit")) {
                        // alert("不能重复参与")
                        message.error({ content: '不能重复参与', key: "deposit" });
                    } else if (err.toString().includes("Invalid Inviter")) {
                        message.error({ content: '不可用的邀请链接', key: "deposit" });
                    } else {
                        message.error({ content: '失败', key: "deposit" });
                    }
                    // hide();
                })
            }).catch(() => {
                message.error({ content: '失败', key: "deposit" });
            })


    }

    componentDidMount = async () => {
        message.config({
            top: 80
        })
        await initContract();
        let account = await getAccount();
        this.setState({ account: account })
        
        await this.getAccountInfo(account);

    }

    initData = async () => {
        let { firstAddress } = this.state;
        message.loading({ content: '初始化数据...', key: "initData", duration: 0 });
        await BP106Proxy.initData(firstAddress).then(async (ret) => {
            await ret.wait().then(() => {
                message.success({ content: '初始化成功', key: "initData" });
            }).catch(() => {
                message.error({ content: '初始化失败', key: "initData" });
            })
        }).catch(() => {
            message.error({ content: '初始化失败', key: "initData" });
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    setVIP = () => {
        let { vipAddress } = this.state;
        message.loading({ content: "打包中...", key: "setVIP", duration: 0 })
        BP106Proxy.setVIP(vipAddress).then(() => {
            message.success({ content: "成功", key: "setVIP" })
        }).catch(() => {
            message.error({ content: "失败", key: "setVIP" })
        });
    }

    initialize = () => {
        message.loading({ content: "初始化合约中...", key: "initialize", duration: 0 })
        BP106Proxy.initialize().then(async (ret) => {
            ret.wait().then(() => {
                message.success({ content: "成功", key: "initialize" })
            }).catch(() => {
                message.error({ content: "失败", key: "initialize" })
            })
        }).catch(() => {
            message.error({ content: "失败", key: "initialize" })
        });
    }

    setOwner = () => {
        let { ownerAddress } = this.state;
        message.loading({ content: "打包中...", key: "setOwner", duration: 0 })
        BP106Proxy.transferOwnership(ownerAddress).then((ret) => {
            ret.wait().then(() => {
                message.success({ content: "成功", key: "setOwner" })
            }).catch(() => {
                message.error({ content: "失败", key: "setOwner" })
            })

        }).catch(() => {
            message.error({ content: "失败", key: "setOwner" })
        });
    }

    setToken = () => {
        let { recieveAddress } = this.state;
        message.loading({ content: "设置接收地址...", key: "setToken", duration: 0 })
        BP106Proxy.setToken(recieveAddress).then(async (ret) => {
            ret.wait().then(() => {
                message.success({ content: "成功", key: "setToken" })
            }).catch(() => {
                message.error({ content: "失败", key: "setToken" })
            })
        }).catch(() => {
            message.error({ content: "失败", key: "setToken" })
        });
    }

    withdraw = async (type) => {
        message.loading({ content: "提现中...", key: "withdraw", duration: 0 })
        switch (type) {
            case 1:
                let { platformAddress1 } = this.state;
                PlatformAddressContract.withdrawPlatform1(utils.parseEther(platformAddress1)).then((ret) => {
                    ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "withdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "withdraw" })
                    })
                }).catch(() => {
                    message.error({ content: "提现失败", key: "withdraw" })
                });
                break;
            case 2:
                let { platformAddress2 } = this.state;
                PlatformAddressContract.withdrawPlatform2(utils.parseEther(platformAddress2)).then((ret) => {
                    ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "withdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "withdraw" })
                    })
                }).catch(() => {
                    message.error({ content: "提现失败", key: "withdraw" })
                });
                break;
            case 3:
                let { platformAddress3 } = this.state;
                PlatformAddressContract.withdrawPlatform3(utils.parseEther(platformAddress3)).then((ret) => {
                    ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "withdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "withdraw" })
                    })
                }).catch(() => {
                    message.error({ content: "提现失败", key: "withdraw" })
                });
                break;
            case 4:
                let { platformAddress4 } = this.state;
                PlatformAddressContract.withdrawPlatform4(utils.parseEther(platformAddress4)).then((ret) => {
                    ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "withdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "withdraw" })
                    })
                }).catch(() => {
                    message.error({ content: "提现失败", key: "withdraw" })
                });
                break;
            case 5:
                let { platformAddress5 } = this.state;
                PlatformAddressContract.withdrawPlatform5(utils.parseEther(platformAddress5)).then((ret) => {
                    ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "withdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "withdraw" })
                    })
                }).catch(() => {
                    message.error({ content: "提现失败", key: "withdraw" })
                });
                break;
        }
    }

    showWithdrawAmount = (account) => {
        switch (account) {
            case this.state.platform1Address:
                return utils.formatEther(this.state.platform1AmountWithdraw)
                break;
            case this.state.platform2Address:
                return utils.formatEther(this.state.platform2AmountWithdraw)
                break;
            case this.state.platform3Address:
                return utils.formatEther(this.state.platform3AmountWithdraw)
                break;
            case this.state.platform4Address:
                return utils.formatEther(this.state.platform4AmountWithdraw)
                break;
            case this.state.platform5Address:
                return utils.formatEther(this.state.platform5AmountWithdraw)
                break;
        }
    }

    setPlatformAddress = async () => {
        let { address1, address2, address3 } = this.state;
        message.loading({ content: "设置项目地址....", key: "setPlatformAddress", duration: 0 })
        PlatformAddressContract.setPlatformAddress(address1, address2, address3).then((ret) => {
            ret.wait().then(() => {
                message.error({ content: "成功", key: "setPlatformAddress" })
            }).catch(() => {
                message.error({ content: "失败", key: "setPlatformAddress" })
            })
        }).catch(() => {
            message.error({ content: "失败", key: "setPlatformAddress" })
        })
    }

    showCollapse = async (lab) => {

        let {account} = this.state;
        switch (lab) {
            case 1:
                if (this.state.second_collapse) {
                    this.setState({
                        second_collapse: false
                    })
                    return;
                }
                let countUsersOfReferrer = await BP106Proxy.countUsersOfReferrer(account);
                // let financialReferrerOfUser = await BP106Proxy.financialReferrerOfUser(account);
                let usersOfReferrer = await BP106Proxy.getUsersOfReferrer(account);
                usersOfReferrer = JSON.parse(JSON.stringify(usersOfReferrer));
                for (let i = 0; i < (usersOfReferrer.length >= 2 ? 2 : usersOfReferrer.length); i++) {
                    let item = {
                        account: usersOfReferrer[i]
                    }

                    let id = await BP106Proxy.serialNumberOfUser(usersOfReferrer[i]);
                    let level = await BP106Proxy.identityOfUser(usersOfReferrer[i]);
                    item.id = id / 1;
                    item.level = level / 1;
                    usersOfReferrer[i] = item;
                }
                this.setState({
                    usersOfReferrer,
                    countUsersOfReferrer,
                    second_collapse: !this.state.second_collapse
                })
            
                break;
            // case 2: 
            //     this.setState({
            //         thrid_collapse: !this.state.thrid_collapse
            //     });
            //     break;
            case 3:
                let directAmount = await BP106Proxy.directAmount(account);
                let seePointAmount = await BP106Proxy.seePointAmount(account);
                let bossAmount = await BP106Proxy.bossAmount(account);
                let poolAmount = await BP106Proxy.poolAmount(account);

                this.setState({

                    directAmount,
                    seePointAmount,
                    bossAmount,
                    poolAmount,
                    fourth_collapse: !this.state.fourth_collapse,

                })
                break;
        }
    }

    emergencyWithdraw = async (type) => {
        message.loading({ content: "提现中....", key: "emergencyWithdraw", duration: 0 })
        switch (type) {
            case 1:
                await BP106Proxy.emergencyWithdraw(utils.parseEther(this.state.emergencyAmount)).then(async (ret) => {
                    await ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "emergencyWithdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "emergencyWithdraw" })
                    })

                }).catch(() => {
                    message.error({ content: "提现失败", key: "emergencyWithdraw" })
                })
                break;
            case 2:
                await PlatformAddressContract.emergencyWithdraw(utils.parseEther(this.state.emergencyAmount_platform)).then(async (ret) => {
                    await ret.wait().then(() => {
                        message.success({ content: "提现成功", key: "emergencyWithdraw" })
                    }).catch(() => {
                        message.error({ content: "提现失败", key: "emergencyWithdraw" })
                    })

                }).catch(() => {
                    message.error({ content: "提现失败", key: "emergencyWithdraw" })
                })
                break;
        }
    }

    showMembers = async () => {
        let hide = message.loading({ content: "加载数据...", key: "showMembers", duration: 0 });

        let usersOfReferrer = await BP106Proxy.getUsersOfReferrer(this.state.account);
        usersOfReferrer = JSON.parse(JSON.stringify(usersOfReferrer));
        for (let i = 0; i < usersOfReferrer.length; i++) {
            let item = {
                account: usersOfReferrer[i]
            }
            let id = await BP106Proxy.serialNumberOfUser(usersOfReferrer[i]);
            let level = await BP106Proxy.identityOfUser(usersOfReferrer[i]);
            item.id = id / 1;
            item.level = level / 1;
            usersOfReferrer[i] = item;
        }


        let members = [];
        for (let i = 0; i < usersOfReferrer.length; i++) {
            let userJoinTime = await BP106Proxy.userJoinTime(usersOfReferrer[i].account);
            usersOfReferrer[i].userJoinTime = userJoinTime / 1;
            members.push(usersOfReferrer[i]);
        }

        this.setState({
            modalTitle: "直推成员",
            isModalOpen: true,
            members
        })
        hide();
    }

    render() {
        let {
            fourth_collapse,
            thrid_collapse,
            second_collapse,
            totalIncome,
            platform1AmountWithdraw,
            platform2AmountWithdraw,
            platform3AmountWithdraw,
            platform4AmountWithdraw,
            platform5AmountWithdraw,
            platformBalance,
            owner,
            countUsersOfReferrer,
            directAmount,
            seePointAmount,
            bossAmount,
            poolAmount,
            isOwner,
            user,
            identityOfUser,
            serialNumberOfUser,
            firstAddress,
            modalTitle,
            members,
            isModalOpen,
            poolBalance,
            sameLevelBoss,
            coutdownObj,
            userReward,
            inviter,
            account,
            serialNumber,
            totalId,
            usersOfReferrer,
            serialNumberOfUser_pool,
            isSpinning,
            platformAddress1Amount,
            platformAddress2Amount,
            platformAddress3Amount,
            platformAddress4Amount,
            platformAddress5Amount,
            platform1Address,
            platform2Address,
            platform3Address,
            platform4Address,
            platform5Address,
            rewardUserId } = this.state;
        poolBalance = utils.formatEther(poolBalance);
        return <div className="container">
            <div className="row">
                <div className="item">
                    <div className="bp-left">
                        <img src="./assets/icons/coutdown.png" />
                        <span>倒计时</span>
                    </div>
                    <div className="right">
                        {`${coutdownObj.hours}:${coutdownObj.minutes}:${coutdownObj.seconds}`}
                    </div>
                </div>
                <div className="item">
                    <div className="bp-left">
                        <img src="./assets/icons/member.png" />
                        <span>当前身份</span>
                    </div>
                    <div className="right">
                        {identityOfUser / 1 == 0 ? "" : (identityOfUser / 1 == 1 ? "AGENT" : "BOSS")}
                    </div>
                </div>
                <div className="item">
                    <div className="bp-left">
                        <img src="./assets/icons/member.png" />
                        <span>参与编号</span>
                    </div>
                    <div className="right">
                        {serialNumberOfUser / 1 == 0 ? 0 : serialNumberOfUser / 1}
                    </div>
                </div>
            </div>
            <div className="row second" style={{height:second_collapse ? "auto" : "50px"}}>
                <h4 className="second-title" onClick={() => this.showCollapse(1)}>
                    <img src="./assets/icons/location.png" />
                    <span>当前排位 {/* serialNumber / 1 */}</span>
                    <div style={{ float: "right", color: "#fff" }}>
                        点击更多
                    </div>
                </h4>
                <div className="buy_area">
                    <div className="buy_btn_box">
                        <button onClick={this.deposit} >BNB1.06<br />一触即发</button>
                    </div>
                </div>
                <div className="share">
                    <p>我的推广</p>
                    <div className="members">
                        {
                            usersOfReferrer.map((v, i) => {
                                return <div className="members_count" key={i}>

                                    {
                                        <div onClick={() => this.showBoss(v)}>
                                            <div><img src="./assets/icons/member_one.png" /></div>
                                            <div>
                                                {formatAddress(v.account)}
                                                <div>{i == 0 ? (v.level == 1 ? "AGENT A" : "BOSS A") : (v.level == 1 ? "AGENT B" : "BOSS B")}</div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            })
                        }
                        <div className="members_count">

                            {
                                countUsersOfReferrer / 1 == 0 ? null : <div onClick={this.showMembers}>
                                    <div><img src="./assets/icons/team_member.png" /></div>
                                    <div>
                                        直推人数：{countUsersOfReferrer / 1}
                                    </div>
                                </div>

                            }
                        </div>

                    </div>

                </div>
                <div className="inviter">
                    <p>邀请链接</p>
                    <p className="inviter_link">{identityOfUser / 1 == 0 ? "需先参与" : window.location.host + window.location.pathname + "?inviter=" + formatAddress(account)}</p>
                    <button className="copy_btn" onClick={this.cpLink} data-clipboard-text={window.location.host + window.location.pathname + "?inviter=" + account}>复制</button>
                </div>
            </div>
            <div className="row" style={{backgroundSize: "cover", backgroundImage: "url('./assets/images/bg1.png')" }}>
                <h4 className="second-title">
                    <img src="./assets/icons/crown.png" />
                    <span>奖池</span>
                    {/* <div style={{ float: "right", color: "#fff" }}>
                        点击更多
                    </div> */}
                </h4>
                <p>
                    <div className="pool">
                        {poolBalance} BNB
                    </div>
                </p>

                <div className="pool_info">
                    <div>
                        <p>当前获奖编号</p>
                        <p>{serialNumberOfUser_pool / 1 == 0 ? 1000 : serialNumberOfUser_pool / 1}</p>
                    </div>
                    <div>
                        <p>即将领奖编号</p>
                        <p> {serialNumberOfUser_pool / 1 == 0 ? 1001 : (serialNumberOfUser_pool / 1) + 1}</p>
                    </div>
                </div>
            </div>
            <div className="row" style={{height:fourth_collapse ? "auto" : "50px",  backgroundSize: "cover", backgroundImage: "url('./assets/images/bg2.png')" }}>
                <h4 className="second-title" onClick={() => this.showCollapse(3)}>
                    <img src="./assets/icons/detail.png" style={{ width: "15px" }} />
                    <span>我的收益明细</span>
                    <div style={{ float: "right", color: "#fff" }}>
                        点击更多
                    </div>
                </h4>

                <div className="item">
                    <div className="bp-left">
                        <span>直推奖</span>
                    </div>
                    <div className="right">
                        {utils.formatEther(directAmount)} BNB
                    </div>
                </div>
                <div className="item">
                    <div className="bp-left">
                        <span>见点奖</span>
                    </div>
                    <div className="right">
                        {utils.formatEther(seePointAmount)} BNB
                    </div>
                </div>
                <div className="item">
                    <div className="bp-left">
                        <span>平级奖</span>
                    </div>
                    <div className="right">
                        {utils.formatEther(bossAmount)} BNB
                    </div>
                </div>
                <div className="item">
                    <div className="bp-left">
                        <span>分红奖</span>
                    </div>
                    <div className="right">
                        {utils.formatEther(poolAmount)} BNB
                    </div>
                    {/* <div className="item">
                    <div className="bp-left">
                        <span>VIP分红</span>
                    </div>
                    <div className="right">
                        {userReward == null ? 0 : utils.formatEther(userReward.vipReward)} BNB
                    </div>
                </div> */}
                </div>
            </div>
            <div style={{ display: owner == "0x" + "0".repeat(40) ? "block" : "none" }}>
                <p></p>
                <p>初始化合约</p>
                <button onClick={this.initialize}>执行</button>
            </div>
            {/* <div className="row" style={{ display: isOwner ? "block" : "none", backgroundSize: "cover", backgroundImage: "url('./assets/images/bg1.png')" }}>
                <h4 className="second-title">
                    <img src="./assets/icons/crown.png" />
                    <span>VIP</span>
                    <div style={{ float: "right", color: "#fff" }}>
                        累计: {utils.formatEther(platformBalance)} BNB
                    </div>
                </h4>

                <div>
                    <p></p>
                    <p>初始化数据</p>
                    <input placeholder="第一个邀请地址" onChange={this.handleChange} name="firstAddress" />
                    &nbsp;
                    <button onClick={this.initData}>执行</button>
                </div>

                <div>
                    <p></p>
                    <p>设置BNB接收者地址</p>
                    <input placeholder="接收地址" onChange={this.handleChange} name="recieveAddress" />
                    &nbsp;
                    <button onClick={this.setToken}>执行</button>
                </div>

                <div>
                    <p></p>
                    <p>拥有者转移</p>
                    <input placeholder="新管理员地址" onChange={this.handleChange} name="ownerAddress" />
                    &nbsp;
                    <button onClick={this.setOwner}>执行</button>
                </div>

                <div>
                    <p></p>
                    <p>紧急提现, 余额：{poolBalance} BNB</p>
                    <input placeholder="提现数量" onChange={this.handleChange} name="emergencyAmount" />
                    &nbsp;
                    <button onClick={() => this.emergencyWithdraw(1)}>执行</button>
                </div>

                <div>
                    <p></p>
                    <p>项目钱包紧急提现, 余额：{utils.formatEther(platformBalance)} BNB</p>
                    <input placeholder="提现数量" onChange={this.handleChange} name="emergencyAmount_platform" />
                    &nbsp;
                    <button onClick={() => this.emergencyWithdraw(2)}>执行</button>
                </div>

                <div>
                    <p></p>
                    <p>项目地址</p>
                    <input placeholder="项目地址1" onChange={this.handleChange} name="address1" />&nbsp;<span className="rate">33.33%</span>
                    <input placeholder="项目地址2" onChange={this.handleChange} name="address2" />&nbsp;<span className="rate">33.33%</span>
                    <input placeholder="项目地址3" onChange={this.handleChange} name="address3" />&nbsp;<span className="rate">16.66%</span>
                    <input placeholder="项目地址4" onChange={this.handleChange} name="address4" />&nbsp;<span className="rate">8.33%</span>
                    <input placeholder="项目地址5" onChange={this.handleChange} name="address5" />&nbsp;<span className="rate">8.33%</span>
                    <br />
                    <button onClick={this.setPlatformAddress}>执行</button>
                </div>

            </div> */}

            <div className="row"
                style={{
                    display: platform1Address.toLocaleLowerCase() == account.toLocaleLowerCase() ||
                        platform2Address.toLocaleLowerCase() == account.toLocaleLowerCase() ||
                        platform3Address.toLocaleLowerCase() == account.toLocaleLowerCase() ||
                        platform4Address.toLocaleLowerCase() == account.toLocaleLowerCase() ||
                        platform5Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none"
                }}
            >
                <h4 className="second-title">
                    <img src="./assets/icons/crown.png" />
                    <span>VIP提现</span>
                    <div style={{ float: "right", color: "#fff" }}>
                        累计: {utils.formatEther(totalIncome)} BNB
                    </div>
                </h4>
                <div
                    style={{ display: platform1Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none" }}
                >
                    <p></p>
                    <p>已提现：{utils.formatEther(platform1AmountWithdraw)} BNB</p>
                    <p>VIP地址余额: {utils.formatEther(platformAddress1Amount)} BNB</p>
                    <input placeholder="提现数量" onChange={this.handleChange} name="platformAddress1" />
                    &nbsp;
                    <button onClick={() => this.withdraw(1)}>执行</button>
                </div>


                <div style={{ display: platform2Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none" }}>
                    <p></p>
                    <p>已提现：{utils.formatEther(platform2AmountWithdraw)} BNB</p>
                    <p>VIP地址余额: {utils.formatEther(platformAddress2Amount)} BNB</p>

                    <input placeholder="提现数量" onChange={this.handleChange} name="platformAddress2" />
                    &nbsp;
                    <button onClick={() => this.withdraw(2)}>执行</button>
                </div>


                <div style={{ display: platform3Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none" }}>
                    <p></p>
                    <p>已提现：{utils.formatEther(platform3AmountWithdraw)} BNB</p>
                    <p>VIP地址余额: {utils.formatEther(platformAddress3Amount)} BNB</p>

                    <input placeholder="提现数量" onChange={this.handleChange} name="platformAddress3" />
                    &nbsp;
                    <button onClick={() => this.withdraw(3)}>执行</button>
                </div>
                <div style={{ display: platform4Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none" }}>
                    <p></p>
                    <p>已提现：{utils.formatEther(platform4AmountWithdraw)} BNB</p>
                    <p>VIP地址余额: {utils.formatEther(platformAddress4Amount)} BNB</p>

                    <input placeholder="提现数量" onChange={this.handleChange} name="platformAddress4" />
                    &nbsp;
                    <button onClick={() => this.withdraw(4)}>执行</button>
                </div>
                <div style={{ display: platform5Address.toLocaleLowerCase() == account.toLocaleLowerCase() ? "block" : "none" }}>
                    <p></p>
                    <p>已提现：{utils.formatEther(platform5AmountWithdraw)} BNB</p>
                    <p>VIP地址余额: {utils.formatEther(platformAddress5Amount)} BNB</p>

                    <input placeholder="提现数量" onChange={this.handleChange} name="platformAddress5" />
                    &nbsp;
                    <button onClick={() => this.withdraw(5)}>执行</button>
                </div>
            </div>

            <Modal title={modalTitle} okText="确定" cancelText="取消" open={isModalOpen} onOk={() => this.setState({ isModalOpen: false })} onCancel={() => this.setState({ isModalOpen: false })}>
                {
                    members.map((v) => {
                        return <p>
                            <div>
                                钱包地址：<a href={EXPOLER + v.account} target="_blank">{v.account}</a>
                            </div>
                            <div>
                                参与编号：{v.id}
                            </div>
                            <div>
                                身份：{v.level == 1 ? "AGENT" : "BOSS"}
                            </div>
                            <div>
                                参与时间：{new Date((v.userJoinTime) * 1000).toLocaleDateString() + " " + new Date((v.userJoinTime) * 1000).toTimeString()}
                            </div>
                        </p>
                    })
                }
            </Modal>

            <div className="mask" style={{ width: "100%", height: "100%", display: isSpinning ? "flex" : "none", position: "absolute", top: 0, left: 0, zIndex: 10000, background: "rgba(0,0,0,0.8)" }}>
                <Spin size="large" tip="读取数据中..." spinning={isSpinning} style={{ color: "#f0b90b", margin: "auto", marginTop: 100 }}></Spin>
            </div>

        </div>
    }
}

export default Main;