import { faker } from '@faker-js/faker'

const times = n => f => [...Array(n)].map((v, i) => f(i))

const capitalize = s => s.slice(0, 1).toUpperCase() + s.slice(1)

const whineBS = () =>
  faker.helpers
    .shuffle([
      faker.name.firstName(),
      capitalize(faker.random.word()),
      capitalize(faker.animal.type()),
      capitalize(faker.color.human())
    ])
    .slice(0, 2)
    .join(' ')

const TestChainData = {
  getWhineForAddress: (address, limit) => {
    return times(limit || 5)(() => ({
      id: faker.random.numeric(4),
      winery: whineBS(),
      vintage: faker.date.past().getFullYear(),
      varietal: whineBS(),
      royalties: Math.random() * 500,
      image:
        'ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png',
      listed: Math.random() > 0.7
    }))
  }
}

export default TestChainData
