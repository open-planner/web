import axios from 'axios'
import HTTP from '../Utils/Enums/Http'
import Auth from '../Utils/Auth'
import { notification } from 'antd';
import _ from 'lodash'
const CancelToken = axios.CancelToken;

const api = axios.create({
  baseURL: "https://open-planner-api.herokuapp.com",
  crossDomain: true,
  auth: {
    username: 'auth',
    password: 'P@55-@uth-1937'
  }
  // cancelToken: new CancelToken(function executor(c) {
  //   // An executor function receives a cancel function as a parameter
  //   cancel = c;
  // })
})

const jsonToQueryString = (json) => {
  return '?' +
    Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key]);
    }).join('&');
}

api.interceptors.request.use(async config => {
  config.data = jsonToQueryString(config.data)

  if (Auth.getToken()) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`
  }

  return config
})


api.interceptors.response.use(
  res => {
    if (res.status === HTTP.OK) {
      console.log(res)
      if (res.data.status.success && Auth.getToken() != null) {
        return res.data
      } else {
        // error in call API
        notification.open({
          message: 'Error',
          description: res.data.status.message,
        });

        // return false
      }
    }

    notification.open({
      message: 'Error',
      description: "Error, recurso da API não encontrada.",
    });

    return false
  },
  error => {
    console.log(error.response.status)
    notification.open({
      message: "Error",
      description: _.unescape(error.response.data.error_description),
    });

    return Promise.reject(error)
  }
)

export default api
