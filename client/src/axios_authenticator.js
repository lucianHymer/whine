import axios from 'axios';
import { Service } from 'axios-middleware';

export function addAxiosAuthenticatorMiddleware(account, library){
  const service = new Service(axios);

  service.register({
    onRequest(config) {
      if(
        config.url.includes("http://localhost:3001/") &&
        !config.url.includes('authentication')
      ){
        console.log('onRequest POST start');
        return axios(`http://localhost:3001/authentication/${account}/initiate`)
          .then(response => {
            const { message } = response.data;
            console.log('onRequest initate', response);
            const signer = library.getSigner();
            return signer.signMessage(message);
          })
          .then(signedMessage => {
            config.headers.WHINE_ADDRESS = account;
            config.headers.WHINE_AUTH = signedMessage;
            console.log('onRequest POST', config);
            return config;
          }).catch(e => {
            console.log('Auth error', e);
          });
      } else {
        console.log('onRequest GET', config);
      }
      return config;
    },
    onSync(promise) {
      console.log('onSync', promise);
      return promise;
    },
    onResponse(response) {
      console.log('onResponse', response);
      return response;
    }
  });
};
