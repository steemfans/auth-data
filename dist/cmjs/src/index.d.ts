export interface SignedData {
    nonce: string;
    timestamp: string;
    signature: string;
}
export declare function signData(data: unknown, privKey: string): SignedData;
export declare function authData(data: SignedData, pubKey: string): boolean;
export declare function getUtcTimestamp(): string;
