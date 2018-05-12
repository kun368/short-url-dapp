import React, { Component } from 'react';

const LIGHT =
  'https://gw.alicdn.com/tfs/TB1KmB6nntYBeNjy1XdXXXXyVXa-224-60.png';
const DARK =
  'https://img.alicdn.com/tfs/TB1saOBbYGYBuNjy0FoXXciBFXa-218-58.png';

export default class Logo extends Component {
  render() {
    const { isDark } = this.props;
    const logo = isDark ? DARK : LIGHT;
    return (
      <div
        className="logo"
        style={{
          height: 32,
          color: '#f40',
          textAlign: 'left',
        }}
      >
          <h1>
              <a href="http://www.zzkun.com" style={{ display: 'block', position: 'relative' }} target="_blank">
                  CodeKun
                  {/*<img src={logo} width="129" height="35" alt="logo" />*/}
              </a>
          </h1>
      </div>
    );
  }
}
