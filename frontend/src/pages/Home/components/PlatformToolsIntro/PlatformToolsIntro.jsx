import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlatformIntro2 extends Component {
  static displayName = 'PlatformIntro2';

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
            'url(https://img.alicdn.com/tfs/TB1d..oRVXXXXX4XVXXXXXXXXXX-2760-1480.png)',
        }}
      >
        <div style={styles.body}>
          <h2 style={styles.title}>强大的缩短网址服务</h2>
          <p style={styles.text}>
              短网址服务可以帮您把长长的网址压缩
            <br />
              让您在微博微信消息中包含更多有趣内容！
              <br />
          </p>
        </div>
        <img
          src="http://zzkun-tuchuang.oss-cn-hangzhou.aliyuncs.com/18-5-12/96324973.jpg"
          alt=""
          width="870"
          height="400"
          style={styles.image}
        />
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: 740,
    overflow: 'hidden',
  },
  body: {
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    marginTop: 50,
  },
  text: {
    fontSize: 14,
    color: '#666',
    lineHeight: '24px',
    letterSpacing: '2px',
  },
  image: {
    margin: '0 auto',
    marginTop: 50,
    display: 'block',
  },
};
