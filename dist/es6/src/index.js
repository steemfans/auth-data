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
import { auth } from '@steemit/steem-js';
import { Signature, PublicKey } from '@steemit/steem-js/lib/auth/ecc';
import { randomBytes } from 'crypto';
var DATA_TIMEOUT = 60 * 2; // second
export function signData(data, privKey) {
    var d = '';
    if (typeof data === 'string')
        d = data;
    if (typeof data === 'object')
        d = JSON.stringify(data);
    if (!auth.isWif(privKey)) {
        throw new Error('unexpected_private_key');
    }
    var nonce = randomBytes(8).toString('hex');
    var timestamp = getUtcTimestamp();
    var sign = Signature.sign("" + d + nonce + timestamp, privKey);
    var signature = sign.toHex();
    return __assign(__assign({}, JSON.parse(d)), { nonce: nonce,
        timestamp: timestamp,
        signature: signature });
}
export function authData(data, pubKey) {
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
    if (parseInt(currentTimestamp, 10) - parseInt(timestamp, 10) > DATA_TIMEOUT) {
        throw new Error('data_timeout');
    }
    var d = JSON.stringify(data, function (k, v) {
        if (['nonce', 'timestamp', 'signature'].indexOf(k) === -1) {
            return v;
        }
        return undefined;
    });
    var msg = new Buffer("" + d + nonce + timestamp);
    var sign = Signature.fromHex(signature);
    return sign.verifyBuffer(msg, PublicKey.fromString(pubKey));
}
export function getUtcTimestamp() {
    var now = new Date();
    var utcTimestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return "" + parseInt((utcTimestamp / 1000).toString(), 10);
}
//# sourceMappingURL=index.js.map