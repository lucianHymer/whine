const isDevelopment = process.env.NODE_ENV === 'development';

const constants = [{
  name: "BACKEND_URL",
  prod: "http://whine-backend.lucianhymer.com",
  devl: "http://localhost:3001",
},{
  name: "IS_GITHUB_PAGES",
  prod: true,
  devl: false,
},{
  name: "HARDHAT_CHAIN_ID",
  prod: 31337,
},{
  name: "ZERO_ADDRESS",
  prod: '0x0000000000000000000000000000000000000000',
},{
  name: "DEMO",
  prod: process.env.DEMO,
}].reduce((constants, constant) => {
  const {name, prod, devl} = constant;
  const useDevVal = isDevelopment && constant.hasOwnProperty('devl');
  return ({
    ...constants,
    [name]: useDevVal ? devl : prod
  });
}, {});

export default constants;
