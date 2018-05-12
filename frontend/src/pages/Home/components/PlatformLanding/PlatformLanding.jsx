import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Search, Feedback} from '@icedesign/base';

const dappAddress = "n22WUXD8sDqRTbhd6229N4GC4stDv8PMnWs";
const netConfig = "mainnet";

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
            overlayVisible: false,
            value: "111222",
        };
    }

    //检查扩展是否已安装，如果安装了扩展，var“webExtensionWallet”将被注入到web页面中1
    checkInstalledPlugin = () => {
        return typeof(webExtensionWallet) !== "undefined";
    };

    onSearch = (value) => {
        const preUrl = value.key;
        console.log(preUrl);

        if (!this.checkInstalledPlugin()) {
            Toast.error("请先安装WebExtensionWallet插件！");
            return;
        }
        const nebulas = require("nebulas");
        const Account = nebulas.Account;
        const neb = new nebulas.Neb();
        neb.setRequest(new nebulas.HttpRequest(`https://${netConfig}.nebulas.io`));

        const from = Account.NewAccount().getAddressString();
        console.log(preUrl, from, dappAddress);

        const contract = {
            function: 'voteFor',
            args: `["${selectedItem}"]`
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
        window.addEventListener('message', function (e) {
            console.log("message received, msg.data: " + JSON.stringify(e.data));
            try {
                if (!!e.data.data.txhash) {
                    console.log("Transaction hash:\n" + JSON.stringify(e.data.data.txhash, null, '\t'));
                }
            } catch (e) {
            }
        });
        Toast.success("已发起交易，提交后Status变为Success即投票成功！")
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
