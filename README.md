# Auth Data SDK

This SDK is for the users who want to use steem user's private key to sign data to auth user identity without jsonrpc.

If you are using jsonrpc as your api protocol, you could refer to this SDK => [https://github.com/steemit/rpc-auth](https://github.com/steemit/rpc-auth) or this SDK => [https://github.com/steemit/koa-jsonrpc](https://github.com/steemit/koa-jsonrpc).

## Usage

### Sign Data

```
import { signData } from '@steemfans/auth-data';

// This is the data what you want to submit to server
const data = {
    username: 'test',
    avatar: '1.png',
};

// This is steem user's posting private key.
const privKeyOfTestUser = '5JP**********tH';

// sign the data
const signedData = signData(data, privKeyOfTestUser);

// submit the signedData
axios.post(url, signedData);  
```

### Auth Signature

```
import { authData } from '@steemfans/auth-data';

// get the submited data
const data = JSON.parse(this.request.body);

// get user's public key. the `getUserPublicKey` need be written by yourself.
const pubKey = yield getUserPublicKey(data.username, 'posting');

// auth the data
if (!authData(data, pubKey)) {
    throw Error('the signature is incorrect.');
}
```

### Other

If you want to use active key to sign data, you can add `auth_type` to the `data`
to point which key you are using.

```
import { signData } from '@steemfans/auth-data';

// This is the data what you want to submit to server
const data = {
    username: 'test',
    avatar: '1.png',
    auth_key: 'active',
};

// This is steem user's active private key.
const privKeyOfTestUser = '5JP**********tH';

// sign the data
const signedData = signData(data, privKeyOfTestUser);

// submit the signedData
axios.post(url, signedData);  
```

```
import { authData } from '@steemfans/auth-data';

// get the submited data
const data = JSON.parse(this.request.body);

// get user's public key. the `getUserPublicKey` need be written by yourself.
const pubKey = yield getUserPublicKey(data.username, data.auth_key);

// auth the data
if (!authData(data, pubKey)) {
    throw Error('the signature is incorrect.');
}
```

## Issues

If you have any issue, please be easy to submit on [the issue page](https://github.com/steemfans/auth-data/issues).

## Vote

I'm also a witness [@ety001](https://steemit.com/@ety001). 
Thank you for [voting me](https://steemlogin.com/sign/account-witness-vote?witness=ety001&approve=1).
