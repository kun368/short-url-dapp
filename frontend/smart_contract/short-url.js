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

    toShort: function (longUrl) {
        var item = this.longMap.get(longUrl);
        if (item) {
            return item;
        }
        item = new Item();
        item.long = longUrl;
        item.short = this.counter.toString(36);
        item.hash = Blockchain.transaction.hash;
        item.create = Blockchain.transaction.from;

        this.longMap.put(item.long, item);
        this.shortMap.put(item.short, item);
        this.counter = this.counter.plus(1);
        return item;
    },

    toLong: function (shortUrl) {
        var item = this.shortMap.get(shortUrl);
        if (!item) {
            throw new Error("shortUrl not exist.");
        }
        return item;
    }
};
module.exports = ShortUrl;
