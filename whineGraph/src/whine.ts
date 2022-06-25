import {
  Transfer as TransferEvent
} from "../generated/Whine/Whine";

import {
  Whine,
  User,
  Transfer
} from "../generated/schema";

import {
  Whine as WhineContract,
} from "../generated/Whine/Whine";

import {
  log,
  ipfs,
  json,
  JSONValue
} from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
  const tokenId = event.params.tokenId;
  const tokenIdStr = tokenId.toString();
  let whine = Whine.load(tokenIdStr);

  if(!whine) {
    const contract = WhineContract.bind(event.address);
    const ipfsURI = contract.tokenURI(tokenId).replace('ipfs://', '');

    whine = new Whine(tokenIdStr);
    whine.tokenID = event.params.tokenId;
    whine.tokenURI = ipfsURI;

    log.debug("URI {}", [ipfsURI]);
    const metadata = ipfs.cat(ipfsURI);
    if(metadata){
      const metaVals = json.fromBytes(metadata).toObject();
      if(metaVals){
        const image = metaVals.get('image');
        if(image){
          whine.image = image.toString();
        }
        const properties = metaVals.get('properties');
        if(properties){
          const propertiesObj = properties.toObject();

          const vintage = propertiesObj.get('vintage');
          if(vintage)
            whine.vintage = vintage.toString();

          const varietal = propertiesObj.get('varietal');
          if(varietal)
            whine.varietal = varietal.toString();

          const winery = propertiesObj.get('winery');
          if(winery)
            whine.winery = winery.toString();
        }
      }
    }
    const owner = event.params.to.toHexString();
    whine.owner = owner;
    whine.save();

    if(!User.load(owner)){
      new User(owner).save();
    }
  }
}
