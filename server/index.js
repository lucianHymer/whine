const ethers = require('ethers');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pinataSDK = require('@pinata/sdk');

const pinata = pinataSDK(ENV.PINATA_API_KEY, ENV.PINATA_API_SECRET);

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const jsonParser = bodyParser.json();

const secret = '123';
const port = 3001;

const nonces = {};

function composeMessage(address, nonce){
  return ethers.utils.solidityPack([ "string", "string" ], [ address, nonce ]);
}

app.get('/', (req, res) => {
  const address = verifyRequestToken(req);
  res.json({message: `Welcome, ${address || "please authenticate"}`});
});

app.post('/', jsonParser, (req, res) => {
  // pinata.testAuthentication().then((result) => {
  //   //handle successful authentication here
  //   console.log(result);
  //   // TODO add options to this call
  //   pinata.pinJSONToIPFS(metadata).then( result => {
  //     console.log('IPFS Hash', result.IpfsHash);
  //     whineContract.mintNft(account, result.IpfsHash, 300)
  //       .catch( e => console.log('Error minting NFT: ', e) );
  //   }).catch((err) => {
  //     console.log('Failed to pin with Pinata: ', err);
  //   });
  // }).catch((err) => {
  //   console.log('Failed to authenticate with Pinata: ', err);
  // });
});

const verifyRequestToken = (req) => {
  const {token} = req.cookies;
  if(!token) return false;
  return jwt.verify(token, secret, (err, decoded) => {
    if(err)
      return res.status(403).send("Unable to verify authentication: " + JSON.stringify(err));
    return decoded.address;
  });
};

app.get('/auth_message/:address', (req, res) => {
  const address = req.params.address;
  const nonce = crypto.randomBytes(20).toString('hex');
  nonces[address] = nonce;
  const message = composeMessage(address, nonce);
  res.json({message});
});

app.post('/authenticate/:address', jsonParser, (req, res) => {
  const address = req.params.address;
  const nonce = nonces[address];
  if(!nonce) return res.status(403).send("Invalid address, request a new auth message");

  const message = composeMessage(address, nonce);
  const signedMessage = req.body.signedMessage;
  let decodedAddress;
  try {
    decodedAddress = ethers.utils.verifyMessage(message, signedMessage);
  } catch(error) {
    return respondError(res, "Unable to decode signature", error);
  }

  console.log(address);
  console.log(decodedAddress);
  if (address !== decodedAddress)
    return res.status(403).send("Invalid signature");

  const authToken = jwt.sign({ address }, secret, { expiresIn: '2592000s' });
  res.
    cookie('token', authToken, { httpOnly: true }).
    // Should be 'secure' once we get HTTPS setup
    // cookie('token', authToken, { httpOnly: true, secure: true }).
    json(JSON.stringify({message: 'User authenticated'}));
});

function respondError(res, message, error){
  return res.status(403).json({errors: [{
    message,
    ...error,
  }]});
}

app.listen(port, () => console.log(`The server is running port ${port}...`));
