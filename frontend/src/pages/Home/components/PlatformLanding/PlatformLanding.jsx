import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Search, Feedback} from '@icedesign/base';
import NebPay from 'nebpay.js'
import axios from 'axios';

const dappAddress = "n1tV65X8J5jvxMu86cxBqFJE9fz6HhCLfwD";
const netConfig = "testnet";

const nebulas = require("nebulas");
const Account = nebulas.Account;
const neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(`https://${netConfig}.nebulas.io`));
const from = Account.NewAccount().getAddressString();

const nebPay = new NebPay();
const Toast = Feedback.toast;

export default class PlatformLanding extends Component {
    static displayName = 'PlatformLanding';

    static propTypes = {
        value: PropTypes.string,
    };

    static defaultProps = {
        value: 'string data',
    };

    constructor(props) {
        super(props);
        this.state = {
            shortResult: ""
        };
    }

    //检查扩展是否已安装，如果安装了扩展，var“webExtensionWallet”将被注入到web页面中1
    checkInstalledPlugin = () => {
        return typeof(webExtensionWallet) !== "undefined";
    };

    executeIntervalQuery = (serialNumber, preUrl) => {
        const thiz = this;
        const intervalQuery = setInterval(function () {
            nebPay.queryPayInfo(serialNumber)
                .then(resp => {
                    const respObject = JSON.parse(resp);
                    console.log("tx result: ", respObject);
                    if (respObject.code === 0) {
                        clearInterval(intervalQuery);
                        thiz.queryShortResult(preUrl);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }, 5000);
    };

    queryShortResult = (preUrl) => {
        axios.post(`https://${netConfig}.nebulas.io/v1/user/call`, {
            "from": from,
            "to": dappAddress,
            "value": "0",
            "nonce": 0,
            "gasPrice": "1000000",
            "gasLimit": "2000000",
            "contract": {
                "args": `["${preUrl}"]`,
                "function": 'toShort'
            }
        })
            .then(response => {
                let t = response.data.result.result;
                let json = JSON.parse(t);
                this.setState({
                    shortResult: "http://" + window.location.host + "/" + json.short
                });

                Toast.success(`已获得您的短URL，并已自动复制到剪贴板！`);
            })
            .catch(function (error) {
                console.log('error', error);
            });
    };


    onSearch = (value) => {
        const preUrl = value.key;
        console.log(preUrl);

        if (!this.checkInstalledPlugin()) {
            Toast.error("请先安装WebExtensionWallet插件！");
            return;
        }
        console.log(preUrl, from, dappAddress);
        const contract = {
            function: 'addItem',
            args: `["${preUrl}"]`
        };
        const serialNumber = nebPay.call(dappAddress, "0", contract.function, contract.args, {
            listener: (resp) => {
                console.log("response of push: ", resp);
                if (JSON.stringify(resp).indexOf("Error") === -1) {
                    Toast.success("已提交交易！");
                    this.executeIntervalQuery(serialNumber, preUrl);
                }
            }
        });
        Toast.success("已发起交易，请确认交易！")
    };

    render() {
        return (
            <div style={styles.wrapper}>
                <div style={styles.body}>
                    <h2 style={styles.title}>
                        星云短网址服务
                    </h2>
                    <span style={styles.title2}>
                        简单 / 易用 / 便捷
                    </span>
                    <Search
                        onSearch={this.onSearch.bind(this)}
                        size="large"
                        searchText="缩短网址"
                        hasIcon={false}
                        autoWidth
                    />
                    {
                        this.state.shortResult.length === 0 ? ('') : (
                            <h1>{this.state.shortResult}</h1>
                        )
                    }
                    <div style={styles.buttons}>
                        <Button
                            style={styles.secondaryButton}
                            type="normal"
                            component="a"
                            href="your-url"
                        >
                            开通
                        </Button>
                        <Button
                            style={styles.primaryButton}
                            type="primary"
                            component="a"
                            href="your-url"
                        >
                            登录
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    buttons: {textAlign: 'center', marginTop: 33},
    body: {
        position: 'absolute',
        top: '190px',
        left: '50%',
        marginLeft: '-300px',
        width: '600px',
        color: '#fff',
        maxHeight: '260px',
        overflow: 'hidden',
        textAlign: 'center',
    },
    wrapper: {
        overflow: 'hidden',
        height: 720,
        backgroundImage:
            'url("https://img.alicdn.com/tfs/TB1DgSmSpXXXXaJXpXXXXXXXXXX-2760-1480.jpg")',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundColor: '#66ABFF',
        boxShadow: '0 1px 16px 0 rgba(0,0,0,0.10)',
    },
    title: {
        fontSize: '32px',
        color: '#333',
        letterSpacing: '2px',
        lineHeight: '48px',
        textAlign: 'center',
    },
    title2: {
        color: '#333',
        letterSpacing: '2px',
        textAlign: 'center',
        lineHeight: '48px',
    },
    primaryButton: {
        height: 50,
        fontSize: 16,
        padding: '0 58px',
        lineHeight: '50px',
        color: '#fff',
    },
    secondaryButton: {
        height: 50,
        fontSize: 16,
        padding: '0 58px',
        lineHeight: '50px',
        marginRight: 20,
        backgroundColor: 'transparent',
        borderColor: '#5485f7',
        color: '#5485f7',
    },
};
