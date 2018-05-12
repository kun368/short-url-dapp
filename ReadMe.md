# Vote-Dapp: 去中心化投票系统

[![Build Status](https://travis-ci.org/kun368/vote-dapp.svg?branch=master)](https://travis-ci.org/kun368/short-url-dapp)
[![Language](https://img.shields.io/badge/language-java-orange.svg)](https://github.com/kun368/short-url-dapp)
[![Language](https://img.shields.io/badge/language-javascript-blue.svg)](https://github.com/kun368/short-url-dapp)

#### [系统地址](http://s.zzkun.com)

#### [NAS-DAPP开发者注册](https://incentive.nebulas.io/cn/signup.html?invite=OILxo)

**基于NAS智能合约的去中心化短网址服务, 构建永久保存、不可篡改的短网址服务系统**

## 简介

该智能合约解决了传统短网址服务中的极易容易篡改为钓鱼网站等痛点。

short-url-dapp不依赖特定的机构，它以利用特定的智能合约技术，使用整个P2P网络中众多节点构成的分布式数据库来记录所有的短网址，并使用密码学的设计来确打开网站的各个环节安全性。

其去中心化特性与算法本身可以确保防范钓鱼网站。

## Snapshot


## 合约

```javascript
"use strict";


var Item = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.long = obj.long;
        this.short = obj.short;
        this.hash = obj.hash;
        this.create = obj.create;
    } else {
        this.long = '';
        this.short = '';
        this.hash = '';
        this.create = '';
    }
};

Item.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var ShortUrl = function () {
    LocalContractStorage.defineMapProperty(this, "longMap", {
        parse: function (text) {
            return new Item(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "shortMap", {
        parse: function (text) {
            return new Item(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "counter", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return new BigNumber(str);
        }
    });
};

ShortUrl.prototype = {
    init: function () {
        this.counter = new BigNumber(1);
    },

    addItem: function (longUrl) {
        var item = this.longMap.get(longUrl);
        if (item) {
            return;
        }
        item = new Item();
        item.long = longUrl;
        item.short = this.counter.toString(36);
        item.hash = Blockchain.transaction.hash;
        item.create = Blockchain.transaction.from;

        this.longMap.put(item.long, item);
        this.shortMap.put(item.short, item);
        this.counter = this.counter.plus(1);
    },

    toShort: function (longUrl) {
        var item = this.longMap.get(longUrl);
        if (!item) {
            throw new Error("not exist.");
        }
        return item;
    },

    toLong: function (shortUrl) {
        var item = this.shortMap.get(shortUrl);
        if (!item) {
            throw new Error("not exist.");
        }
        return item;
    }
};
module.exports = ShortUrl;
```