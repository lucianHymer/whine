import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from '../generated/Whine/Whine'

import { Whine, User, Transfer, Approval } from '../generated/schema'

import { Whine as WhineContract } from '../generated/Whine/Whine'

import {
  log,
  ipfs,
  json,
  JSONValue,
  BigInt,
  Address
} from '@graphprotocol/graph-ts'

// TODO add approvalForAll watcher
export function handleApproval (event: ApprovalEvent): void {
  const tokenId = event.params.tokenId
  const tokenIdStr = tokenId.toString()
  const blockNum = event.block.number
  const approvedAddress = event.params.approved

  const whine = new Whine(tokenIdStr)

  whine.approvalUpdatedBlock = blockNum

  // === doesn't work here, need to look into why
  if (approvedAddress == Address.zero()) {
    log.debug('Disapprove at block {}', [blockNum.toString()])
    whine.listed = false
  } else {
    log.debug('Approve at block {}', [blockNum.toString()])
    whine.listed = true
  }

  whine.approvedAddress = approvedAddress

  whine.save()
}

export function handleTransfer (event: TransferEvent): void {
  const tokenId = event.params.tokenId
  const tokenIdStr = tokenId.toString()
  const whine = new Whine(tokenIdStr)

  if (!whine.image || !whine.winery) {
    populateWhineMetadata(whine, event.address, tokenId)
  }

  whine.listed = false

  const owner = event.params.to.toHexString()
  whine.owner = owner
  whine.save()

  if (!User.load(owner)) {
    new User(owner).save()
  }
}

function populateWhineMetadata (
  whine: Whine,
  contractAddress: Address,
  tokenId: BigInt
): void {
  const contract = WhineContract.bind(contractAddress)
  const ipfsURI = contract.tokenURI(tokenId).replace('ipfs://', '')

  whine.tokenID = tokenId
  whine.tokenURI = ipfsURI
  whine.royalties = contract
    .royaltyInfo(tokenId, BigInt.fromI32(10000))
    .getValue1()

  log.debug('URI {}', [ipfsURI])
  let metadata = ipfs.cat(ipfsURI)
  while (!metadata) {
    log.debug('IPFS Retry', [])
    metadata = ipfs.cat(ipfsURI)
  }
  const metaVals = json.fromBytes(metadata!).toObject()
  if (metaVals) {
    const image = metaVals.get('image')
    if (image) {
      whine.image = image.toString()
    }
    const properties = metaVals.get('properties')
    if (properties) {
      const propertiesObj = properties.toObject()

      const vintage = propertiesObj.get('vintage')
      if (vintage) whine.vintage = vintage.toString()

      const varietal = propertiesObj.get('varietal')
      if (varietal) whine.varietal = varietal.toString()

      const winery = propertiesObj.get('winery')
      if (winery) whine.winery = winery.toString()
    }
  }
}

function getWhineForId (tokenIdStr: String): Whine {
  let whine = Whine.load(tokenIdStr)

  if (!whine) {
    whine = new Whine(tokenIdStr)
  }

  return whine
}
