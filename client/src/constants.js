const isDevelopment = process.env.NODE_ENV === 'development';

const constants = [{
  name: "BACKEND_URL",
  prod: "http://whine-backend.lucianhymer.com",
  devl: "http://localhost:3001",
},{
  name: "IS_GITHUB_PAGES",
  prod: true,
  devl: false,
}].reduce((constants, {name, prod, devl}) => ({
  ...constants,
  [name]: isDevelopment ? devl : prod
}), {});

export default constants;
