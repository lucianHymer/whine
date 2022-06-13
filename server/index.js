require('dotenv').config();
const ethers = require('ethers');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const pinataSDK = require('@pinata/sdk');
const cors = require('cors');
const NodeCache = require( "node-cache" );

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const jsonParser = bodyParser.json();

const nonceCache = new NodeCache({
  stdTtl: 20, // seconds
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

  if (address !== decodedAddress)
    return res.status(403).send("Invalid signature");

  res.locals.address = address;

  next();
};

app.post('/create_nft_metadata', jsonParser, verifyAuthentication, (req, res) => {
  const { address } = res.locals;
  console.log('body', req.body);
  const { metadata } = req.body;
  pinata.testAuthentication().then((result) => {
    // TODO add options to this call to enable searching on IPFS
    pinata.pinJSONToIPFS(metadata).then( result => {
      console.log('IPFS Hash', result.IpfsHash);
      res.json({'ipfsHash': result.IpfsHash});
    }).catch((err) => {
      return respondError(res, 'Failed to pin with Pinata', err);
    });
  }).catch((err) => {
    return respondError(res, 'Failed to authenticate with Pinata', err);
  });
});

app.get('/', (req, res) => {
  res.json({message: `Welcome, ${req.locals.address || "please authenticate"}`});
});

app.get('/authentication/:address/initiate', (req, res) => {
  const address = req.params.address;
  const nonce = crypto.randomBytes(20).toString('hex');
  nonceCache.set(address, nonce);
  const message = composeMessage(address, nonce);
  res.json({message});
});

// TODO add an if-testing to return error
function respondError(res, message, error){
  return res.status(403).json({errors: [{
    message,
    ...error,
  }]});
}

app.listen(port, () => console.log(`The server is running port ${port}...`));
