import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Search, Feedback} from '@icedesign/base';
import axios from 'axios';
import Clipboard from 'clipboard';

const dappAddress = "n1iJMbSL3FsdHuwhtPws4wdiDPDeWguyALU";
const netConfig = "mainnet";

const nebulas = require("nebulas");
const Account = nebulas.Account;
const neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(`https://${netConfig}.nebulas.io`));
const from = Account.NewAccount().getAddressString();

const Toast = Feedback.toast;
const clipboard = new Clipboard('#copyBtn');

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

    executeIntervalQuery = (txhash, preUrl) => {
        const thiz = this;
        const intervalQuery = setInterval(function () {
            axios.post(`https://${netConfig}.nebulas.io/v1/user/getTransactionReceipt`, {
                hash: txhash
            }).then(response => {
                let t = response.data.result.status;
                if (t === 1) {
                    clearInterval(intervalQuery);
                    thiz.queryShortResult(preUrl);
                }
            }).catch(function (error) {
                console.log('error', error);
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
        }).then(response => {
            let t = response.data.result.result;
            console.log(t);
            let json = JSON.parse(t);
            this.setState({
                shortResult: "http://" + window.location.host + "/" + json.short
            });
            // window.clipboardData.setData("Text", this.state.shortResult);
            Toast.success(`已将短网址复制到剪贴板！`);
        }).catch(function (error) {
            console.log('error', error);
        });
    };

    checkValidLink = (url) => {
        const urlRegex = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
        let regExp = new RegExp(urlRegex);
        return regExp.test(url);
    };

    clickCopyBtn = () => {
        Toast.success('已将短网址复制到剪切板');
    };

    onSearch = (value) => {
        const preUrl = value.key;
        if (!this.checkValidLink(preUrl)) {
            this.setState({
                shortResult: ''
            });
            Toast.error("您输入的不是标准URL链接，请重新输入");
            return;
        }
        if (!this.checkInstalledPlugin()) {
            Toast.error("请先安装Chrome浏览器扩展，页面左上角有下载地址");
            return;
        }
        console.log(preUrl, from, dappAddress);
        const contract = {
            function: 'addItem',
            args: `["${preUrl}"]`
        };
        window.postMessage({
            "target": "contentscript",
            "data": {
                "to": dappAddress,
                "value": "0",
                "contract": {
                    "function": contract.function,
                    "args": contract.args
                }
            },
            "method": "neb_sendTransaction",
        }, "*");
        window.addEventListener('message', resp => {
            console.log("response of push: ", resp);
            try {
                const dat = resp.data.data;
                if (!!dat.txhash) {
                    console.log("Transaction hash:\n" + JSON.stringify(dat.txhash, null, '\t'));
                    if (JSON.stringify(dat).indexOf("Error") === -1) {
                        Toast.success("已提交交易！");
                        this.executeIntervalQuery(dat.txhash.txhash, preUrl);
                    }
                }
            } catch (e) {
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
                        简单易用&nbsp;&nbsp;/&nbsp;&nbsp;
                        永不丢失&nbsp;&nbsp;/&nbsp;&nbsp;
                        无法篡改
                    </span>
                    <Search
                        onSearch={this.onSearch.bind(this)}
                        size="large"
                        searchText="缩短网址"
                        hasIcon={false}
                        placeholder="请输入原始网址"
                        autoWidth
                    />
                    {this.state.shortResult.length === 0 ? ('') : (
                        <span style={styles.title2}>短网址：
                            <a href={this.state.shortResult} target="_blank" id="foo">
                                {this.state.shortResult}
                            </a>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                size="small"
                                type="primary"
                                data-clipboard-target="#foo"
                                onClick={this.clickCopyBtn.bind(this)}
                                id="copyBtn">复制
                            </Button>
                        </span>
                    )}
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
