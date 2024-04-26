const productionURL = 'http://localhost:8080';

const developmentURL = 'http://localhost:8080';

const serverURL =
  process.env.NODE_ENV === 'development' ? developmentURL : productionURL;


export const baseURL = `${serverURL}/api`;
// export const baseURL = `${serverURL}/backend/api`;

export default {};

