const isDevelopment = process.env.NODE_ENV === 'development';

const constants = [{
  name: "BACKEND_URL",
  prod: "http://whine-backend.lucianhymer.com",
  devl: "http://localhost:3001",
}].reduce((constants, {name, prod, devl}) => ({
  ...constants,
  [name]: (isDevelopment && devl) ? devl : prod
}), {});

export default constants;
