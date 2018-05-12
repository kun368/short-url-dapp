import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@icedesign/base';

export default class PlatformJoinUs extends Component {
  static displayName = 'PlatformJoinUs';

  static propTypes = {
    value: PropTypes.string,
  };

  static defaultProps = {
    value: 'string data',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          ...styles.wrapper,
          backgroundImage:
            'url(http://zzkun-tuchuang.oss-cn-hangzhou.aliyuncs.com/18-5-12/83979194.jpg)',
        }}
      >
        <div>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>现在就开始使用</h2>
            <p style={{color: '#fff'}}>
              在区块链将世界万物结合的未来
                <br />
                体验安全、去中心、不可篡改的服务
            </p>
          </div>
          <div style={styles.buttons}>
            {/*<Button*/}
              {/*style={styles.secondaryButton}*/}
              {/*type="normal"*/}
              {/*component="a"*/}
              {/*href="your-url"*/}
            {/*>*/}
              {/*开通*/}
            {/*</Button>*/}
            <Button
              style={styles.primaryButton}
              type="primary"
              component="a"
              href="https://incentive.nebulas.io/cn/signup.html?invite=OILxo"
              target="_blank"
            >
              我也要开发去中心化应用
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: 740,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  titleWrapper: {
    textAlign: 'center',
    paddingTop: 200,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    letterSpacing: '2px',
    lineHeight: '48px',
    textAlign: 'center',
  },
  buttons: { textAlign: 'center', marginTop: '60px' },
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
