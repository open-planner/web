import axios from 'axios'
import HTTP from '../Utils/Enums/Http'
import I18n from 'i18n'
import Auth from '../Utils/Auth'
import { baseURL } from 'Utils/Constants'
import { notification } from 'antd';
import _ from 'lodash'
const CancelToken = axios.CancelToken;
let cancel

const api = axios.create({
  baseURL,
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
})


api.interceptors.request.use(async config => {
  if (Auth.getToken() && Auth.getRule() !== 'anonymous' || config.url === '/login') {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`
  } else {
    if (!_.isEmpty(localStorage))
      cancel('Error.Token.Access')
  }

  return config
})


api.interceptors.response.use(
  res => {
    if (res.status === HTTP.OK) {
      if (res.data.status.success && Auth.getToken() != null) {
        return res.data
      } else {
        // error in call API
        notification.open({
          message: 'Error',
          description:
            I18n.t(res.data.status.message),
        });

        return false
      }
    }

    return false
  },
  error => {
    if (error.message === "Error.Token.Access" || error.response.status === HTTP.UNAUTHORIZED) {
      notification.open({
        message: 'Error',
        description:
          I18n.t('general.error.apiConnectionUnauthorized'),
      });

      setTimeout(() => {
        window.location.reload()
        localStorage.clear()
      }, 3000);

      return Promise.reject(error)
    }

    if (!error.response) {
      notification.open({
        message: 'Error',
        description:
          I18n.t('general.error.apiConnection'),
      });

      setTimeout(() => {
        window.location.reload()
        localStorage.clear()
      }, 3000);

      return Promise.reject(error)
    }
  }
)

export default api
