import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/Whine/Whine";

import {
  Whine,
  User,
  Transfer,
  Approval
} from "../generated/schema";

import {
  Whine as WhineContract,
} from "../generated/Whine/Whine";

import {
  log,
  ipfs,
  json,
  JSONValue,
  BigInt,
} from "@graphprotocol/graph-ts";

// export function handleApproval(event: ApprovalEvent): void {
//   const tokenId = event.params.tokenId;
//   const tokenIdStr = tokenId.toString();
//   let whine = Whine.load(tokenIdStr);
// 
//   if(!whine || !whine.image || !whine.winery) {
//     const contract = WhineContract.bind(event.address);
//     const ipfsURI = contract.tokenURI(tokenId).replace('ipfs://', '');
// 
//     whine = new Whine(tokenIdStr);
//     whine.tokenID = tokenId;
//     whine.tokenURI = ipfsURI;
// 
//     whine.royalties = contract.royaltyInfo(tokenId, BigInt.fromI32(10000)).getValue1(); 
// 
//     log.debug("URI {}", [ipfsURI]);
//     const metadata = ipfs.cat(ipfsURI);
//     if(metadata){
//       const metaVals = json.fromBytes(metadata).toObject();
//       if(metaVals){
//         const image = metaVals.get('image');
//         if(image){
//           whine.image = image.toString();
//         }
//         const properties = metaVals.get('properties');
//         if(properties){
//           const propertiesObj = properties.toObject();
// 
//           const vintage = propertiesObj.get('vintage');
//           if(vintage)
//             whine.vintage = vintage.toString();
// 
//           const varietal = propertiesObj.get('varietal');
//           if(varietal)
//             whine.varietal = varietal.toString();
// 
//           const winery = propertiesObj.get('winery');
//           if(winery)
//             whine.winery = winery.toString();
//         }
//       }
//     }
//     const owner = event.params.to.toHexString();
//     whine.owner = owner;
//     whine.save();
// 
//     if(!User.load(owner)){
//       new User(owner).save();
//     }
//   }
// }

export function handleTransfer(event: TransferEvent): void {
  const tokenId = event.params.tokenId;
  const tokenIdStr = tokenId.toString();
  let whine = Whine.load(tokenIdStr);

  if(!whine) {
    whine = new Whine(tokenIdStr);
  }

  if(!whine.image || !whine.winery) {
    const contract = WhineContract.bind(event.address);
    const ipfsURI = contract.tokenURI(tokenId).replace('ipfs://', '');

    whine.tokenID = tokenId;
    whine.tokenURI = ipfsURI;
    whine.royalties = contract.royaltyInfo(tokenId, BigInt.fromI32(10000)).getValue1(); 

    log.debug("URI {}", [ipfsURI]);
    let metadata = ipfs.cat(ipfsURI);
    while(!metadata){
      log.debug("IPFS Retry", []);
      metadata = ipfs.cat(ipfsURI);
    }
    const metaVals = json.fromBytes(metadata!).toObject();
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
    const owner = event.params.to.toHexString();
    whine.owner = owner;
    whine.save();

    if(!User.load(owner)){
      new User(owner).save();
    }
  }
}

// function getWhineMetadata(whine){
// }
