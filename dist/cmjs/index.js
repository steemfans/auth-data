"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var steem_js_1 = require("@steemit/steem-js");
var ecc_1 = require("@steemit/steem-js/lib/auth/ecc");
var crypto_1 = require("crypto");
var DATA_TIMEOUT = 60 * 2; // second
function signData(data, privKey) {
    var d = '';
    if (typeof data === 'string')
        d = data;
    if (typeof data === 'object')
        d = JSON.stringify(data);
    if (!steem_js_1.auth.isWif(privKey)) {
        throw new Error('unexpected_private_key');
    }
    var nonce = crypto_1.randomBytes(8).toString('hex');
    var timestamp = getUtcTimestamp();
    var sign = ecc_1.Signature.sign("" + d + nonce + timestamp, privKey);
    var signature = sign.toHex();
    return __assign(__assign({}, data), { nonce: nonce,
        timestamp: timestamp,
        signature: signature });
}
function unsignData(data, pubKey) {
    var nonce = data.nonce, timestamp = data.timestamp, signature = data.signature;
    var currentTimestamp = getUtcTimestamp();
    if (nonce === undefined) {
        throw new Error('lost_nonce');
    }
    if (timestamp === undefined) {
        throw new Error('lost_timestamp');
    }
    if (signature === undefined) {
        throw new Error('lost_signature');
    }
    if (parseInt(currentTimestamp, 10) - timestamp > DATA_TIMEOUT) {
        throw new Error('data_timeout');
    }
    var d = JSON.stringify(data, function (k, v) {
        if (['nonce', 'timestamp', 'signature'].indexOf(k) === -1) {
            return v;
        }
        return undefined;
    });
    var msg = new Buffer("" + d + nonce + timestamp);
    var sign = ecc_1.Signature.fromHex(signature);
    return sign.verifyBuffer(msg, ecc_1.PublicKey.fromString(pubKey));
}
function getUtcTimestamp() {
    var now = new Date();
    var utcTimestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return "" + parseInt((utcTimestamp / 1000).toString(), 10);
}
module.exports = {
    signData: signData,
    unsignData: unsignData,
};
//# sourceMappingURL=index.js.map