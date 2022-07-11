import axios from 'axios'
import constants from 'whineConstants'
import { Service } from 'axios-middleware'

// TODO add cancellation of orig request on auth failure
// TODO cancel toast on sign/reject
// TODO Add a "I see that you rejected" message on reject

const add = (account, library, errorHandler) => {
  const service = new Service(axios)

  const middleware = {
    onRequest (config) {
      if (
        config.url.includes(constants.BACKEND_URL) &&
        !config.url.includes('authentication')
      ) {
        console.log('onRequest POST start')

        return axios(
          `${constants.BACKEND_URL}/authentication/${account}/initiate`
        )
          .then(response => {
            const { message } = response.data
            const signer = library.getSigner()
            return signer.signMessage(message)
          })
          .then(signedMessage => {
            config.headers.WHINE_ADDRESS = account
            config.headers.WHINE_AUTH = signedMessage
            return config
          })
          .catch(e => {
            console.log('Auth error', e)
            errorHandler(e.message)
            return config
          })
      } else {
        console.log('onRequest GET', config)
      }
      return config
    },
    onSync (promise) {
      console.log('onSync', promise)
      return promise
    },
    onResponse (response) {
      console.log('onResponse', response)
      return response
    }
  }
  service.register(middleware)

  return [service, middleware]
}

const remove = ([service, middleware]) => {
  console.log('Removing middleware')
  service.unregister(middleware)
}

const axiosAuthenticatorMiddleware = { add, remove }
export default axiosAuthenticatorMiddleware
