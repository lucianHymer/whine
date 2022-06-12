const ethers = require('ethers');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pinataSDK = require('@pinata/sdk');
const cors = require('cors');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
const NodeCache = require( "node-cache" );

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

const jsonParser = bodyParser.json();

const nonceCache = new NodeCache({
  stdTtl: 20,
  checkPeriod: 120,
});

const port = 3001;

const composeMessage = (address, nonce) => {
  return ethers.utils.solidityPack([ "string", "string" ], [ address, nonce ]);
};

const verifyAuthentication = (req, res, next) => {
  const address = req.header('WHINE_ADDRESS');
  const signedMessage = req.header('WHINE_AUTH');
  console.log('address', address);
  if(!nonceCache.has(address))
    return res.status(403).send("Invalid address, initiate a new auth request");

  const nonce = nonceCache.take(address);

  const message = composeMessage(address, nonce);
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

  res.locals.address = address;

  next();
};

app.post('/create_nft_metadata', jsonParser, verifyAuthentication, (req, res) => {
  const address = res.locals.address;
  res.json({message: `Welcome, ${address || "please authenticate"}`});
});

app.get('/', (req, res) => {
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

app.get('/authentication/:address/initiate', (req, res) => {
  const address = req.params.address;
  const nonce = crypto.randomBytes(20).toString('hex');
  nonceCache.set(address, nonce);
  const message = composeMessage(address, nonce);
  res.json({message});
});

function respondError(res, message, error){
  return res.status(403).json({errors: [{
    message,
    ...error,
  }]});
}

app.listen(port, () => console.log(`The server is running port ${port}...`));
