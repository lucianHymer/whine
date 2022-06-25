const GraphChainData = {
  getWhineForAddress: (address, limit) => {
    return times(limit || 5)(() => ({
      id: faker.random.numeric(4),
      winery: whineBS(),
      vintage: faker.date.past().getFullYear(),
      varietal: whineBS(),
      royalties: (Math.random() * .5),
      image: 'ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png',
    }));
  },
};


export default GraphChainData;
