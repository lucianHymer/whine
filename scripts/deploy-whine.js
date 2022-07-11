const hre = require('hardhat')
const fs = require('fs')

async function main () {
  const Whine = await hre.ethers.getContractFactory('Whine')
  const whine = await Whine.deploy()
  const WhineMarket = await hre.ethers.getContractFactory('WhineMarket')

  await whine.deployed()
  const whineMarket = await WhineMarket.deploy(whine.address, 100, true)
  await whineMarket.deployed()

  await whine.registerMarket(whineMarket.address)

  writeNetworkToAbi('Whine', whine)
  writeNetworkToAbi('WhineMarket', whineMarket)

  const signer = whine.signer.address
  console.log('signer', signer)

  const tx = await whineMarket['registerWinery(address,string)'](
    signer,
    "Lucian's Whines"
  )
  await tx.wait()
  await whineMarket.approveWinery(signer)

  console.log('Whine deployed to:', whine.address)
  console.log('WhineMarket deployed to:', whineMarket.address)
}

function writeNetworkToAbi (name, contract) {
  const path = `./artifacts/contracts/${name}.sol/${name}.json`
  const altPath = `./client/src/contracts/${name}.sol/${name}.json`

  const abiContents = getNewAbiContents(contract, path)

  ;[path, altPath].map(path =>
    fs.mkdir(`./client/src/contracts/${name}.sol`, { recursive: true }, err => {
      if (err) console.log(err)
      fs.writeFileSync(path, JSON.stringify(abiContents), err => {
        if (err) console.log(err)
        console.log(`Wrote networks to ${path} and ${altPath}`)
      })
    })
  )
}

function getNewAbiContents (contract, path) {
  const { address, provider } = contract
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
