import axios from 'axios';
import constants from 'constants';
import { Service } from 'axios-middleware';

// TODO add cancellation of orig request on auth failure
// TODO cancel toast on sign/reject
// TODO Add a "I see that you rejected" message on reject

export function addAxiosAuthenticatorMiddleware(account, library, errorHandler, signAlertHandler){
  const service = new Service(axios);

  service.register({
    onRequest(config) {
      if(
        config.url.includes(constants.BACKEND_URL) &&
        !config.url.includes('authentication')
      ){
        console.log('onRequest POST start');
        signAlertHandler();

        return axios(`${constants.BACKEND_URL}/authentication/${account}/initiate`)
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
            errorHandler(e.message);
            return config;
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
