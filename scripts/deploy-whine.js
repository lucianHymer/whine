const hre = require('hardhat')
const fs = require('fs')

async function main () {
  const Whine = await hre.ethers.getContractFactory('Whine')
  const whine = await Whine.deploy(100, true)

  await whine.deployed()

  writeNetworkToAbi(whine)

  const signer = whine.signer.address
  console.log('signer', signer)

  const tx = await whine['registerWinery(address,string)'](
    signer,
    "Lucian's Whines"
  )
  await tx.wait()
  await whine.approveWinery(signer)

  console.log('Whine deployed to:', whine.address)
}

function writeNetworkToAbi (whine) {
  const path = './artifacts/contracts/Whine.sol/Whine.json'
  const altPath = './client/src/contracts/Whine.sol/Whine.json'

  const abiContents = getNewAbiContents(whine, path)

  ;[path, altPath].map(path =>
    fs.mkdir('./client/src/contracts/Whine.sol', { recursive: true }, err => {
      if (err) console.log(err)
      fs.writeFileSync(path, JSON.stringify(abiContents), err => {
        if (err) console.log(err)
        console.log(`Wrote networks to ${path} and ${altPath}`)
      })
    })
  )
}

function getNewAbiContents (whine, path) {
  const { address, provider } = whine
  const chainId = provider._network.chainId

  const whineArtifactsContents = fs.readFileSync(path)
  const whineArtifacts = JSON.parse(whineArtifactsContents)

  whineArtifacts.networks ||= {}
  whineArtifacts.networks[chainId] = { address }

  return whineArtifacts
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
