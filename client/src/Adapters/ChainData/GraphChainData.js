import axios from 'axios';

const GraphChainData = {
  getWhineForAddress: async (address, limit) => {
    const response = await axios.post(
      'https://api.thegraph.com/subgraphs/name/lucianhymer/whine',
      {
        query: `
          {
            users (where: {id: "${address.toLowerCase()}"}) {
              id
              Whines (orderBy: tokenID ${limit && `first: ${limit}`}) {
                id
                tokenID
                tokenURI
                image
                winery
                vintage
                varietal
              }
            }
          }
        `
      }
    );
    console.log('whines', ((response?.data?.data?.users || [])[0] || {}).Whines || []);
    return ((response?.data?.data?.users || [])[0] || {}).Whines || []
  },
};


export default GraphChainData;
