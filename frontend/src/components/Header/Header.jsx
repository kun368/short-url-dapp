import React, {Component} from 'react';
import {Input, Balloon, Icon} from '@icedesign/base';
import Menu from '@icedesign/menu';
import Logo from '../Logo';
import './Header.scss';

const MENUS = [
    {
        name: '安装Chrome插件',
        path: 'https://github.com/ChengOrangeJu/WebExtensionWallet',
    },
    {
        name: '联系开发者',
        path: 'http://www.zzkun.com',
    },
    {
        name: '开发Dapp应用',
        path: 'https://incentive.nebulas.io/cn/signup.html?invite=OILxo',
    },
    {
        name: '友情短网址服务',
        children: [
            {
                name: '百度短网址',
                path: 'http://dwz.cn/',
            },
            {
                name: '新浪短网址',
                path: 'http://dwz.wailian.work/',
            },
            {
                name: 'FT12短网址',
                path: 'http://www.ft12.com/',
            },
        ],
    },
];

export default class Header extends Component {
    renderBalloonContent = (menu, idx) => {
        return (
            <Menu.Item key={idx}>
                <Balloon
                    className="header-balloon-content"
                    closable={false}
                    triggerType="click"
                    trigger={
                        <a>
                            {menu.name}{' '}
                            <Icon
                                size="xxs"
                                type="arrow-down-filling"
                                className="arrow-down-filling-icon"
                            />
                        </a>
                    }
                >
                    {menu.children.map((subMenu, idx) => {
                        return (
                            <a href={subMenu.path} className="custom-sub-menu" key={idx} target="_blank">
                                {subMenu.name}
                            </a>
                        );
                    })}
                </Balloon>
            </Menu.Item>
        );
    };

    renderMenuItem = () => {
        return MENUS.map((menu, idx) => {
            if (menu.children) {
                return this.renderBalloonContent(menu, idx);
            }
            return (
                <Menu.Item key={menu.path}>
                    <a href={menu.path} target="_blank">{menu.name}</a>
                </Menu.Item>
            );
        });
    };

    render() {
        return (
            <div className="header-container">
                <div className="header-content">
                    {/*<Logo isDark={true} />*/}
                    <div className="header-navbar">
                        <Menu className="header-navbar-menu" mode="horizontal">
                            {this.renderMenuItem()}
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }
}
