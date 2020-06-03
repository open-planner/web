import axios from 'axios'
import HTTP from '../Utils/Enums/Http'
import Auth from '../Utils/Auth'
import { notification } from 'antd';
import _ from 'lodash'
const CancelToken = axios.CancelToken;

const api = axios.create({
  baseURL: "https://open-planner-api.herokuapp.com",
  crossDomain: true
  // cancelToken: new CancelToken(function executor(c) {
  //   // An executor function receives a cancel function as a parameter
  //   cancel = c;
  // })
})

const jsonToQueryString = (json) => {
  return '' +
    Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key]);
    }).join('&');
}

api.interceptors.request.use(async config => {
  if (config.data && config.url === '/oauth/token')
    config.data = jsonToQueryString(config.data)

  if (Auth.getToken() && !/\/public/.test(config.url)) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`
  } else {
    config.auth = {
      username: 'auth',
      password: 'P@55-@uth-1937'
    }
  }

  return config
})


api.interceptors.response.use(
  res => {
    if (res.status === HTTP.OK || res.status === HTTP.REQUEST_OK || res.status === 204) {
      return res.data || true
    }

    notification.open({
      message: 'Error',
      description: "Error, recurso da API não encontrada.",
    });

    return false
  },
  error => {
    if (_.isArray(error.response.data)) {
      notification.open({
        message: 'Error',
        description: error.response.data.join('\n'),
      });
    } else {
      notification.open({
        message: "Error",
        description: _.unescape(error.response.data.error_description),
      });
    }

    if (error.response.data.error === 'invalid_token') {
      Auth.signOut()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
