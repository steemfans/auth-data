import { auth } from '@steemit/steem-js'
import { Signature, PublicKey } from '@steemit/steem-js/lib/auth/ecc'
import { randomBytes } from 'crypto'

const DATA_TIMEOUT: number = 60 * 2 // second

export interface SignedData {
    nonce: string;
    timestamp: string;
    signature: string;
}

export function signData(data: unknown, privKey: string): SignedData {
    let d = ''
    if (typeof data === 'string') d = data
    if (typeof data === 'object') d = JSON.stringify(data)
    if (!auth.isWif(privKey)) {
        throw new Error('unexpected_private_key')
    }

    const nonce: string = randomBytes(8).toString('hex')
    const timestamp: string = getUtcTimestamp()

    const sign = Signature.sign(`${d}${nonce}${timestamp}`, privKey)
    const signature: string = sign.toHex()
    return {
        ...JSON.parse(d),
        nonce,
        timestamp,
        signature,
    }
}

export function authData(data: SignedData, pubKey: string): boolean {
    const { nonce, timestamp, signature } = data
    const currentTimestamp: string = getUtcTimestamp()
    if (nonce === undefined) {
        throw new Error('lost_nonce')
    }
    if (timestamp === undefined) {
        throw new Error('lost_timestamp')
    }
    if (signature === undefined) {
        throw new Error('lost_signature')
    }
    if (parseInt(currentTimestamp, 10) - parseInt(timestamp, 10) > DATA_TIMEOUT) {
        throw new Error('data_timeout')
    }
    const d: string = JSON.stringify(data, (k, v) => {
        if (['nonce', 'timestamp', 'signature'].indexOf(k) === -1) {
            return v
        }
        return undefined
    })
    const msg: Buffer = new Buffer(`${d}${nonce}${timestamp}`)
    const sign = Signature.fromHex(signature)
    return sign.verifyBuffer(msg, PublicKey.fromString(pubKey))
}

export function getUtcTimestamp():string {
    const now: Date = new Date()
    const utcTimestamp: number = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    )
    return `${parseInt((utcTimestamp / 1000).toString(), 10)}`
}
