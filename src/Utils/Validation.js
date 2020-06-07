import _ from 'lodash'

export default {
  password: pass => {
    const regex = /(?=.*[0-9]+.*)(?=.*[A-Z]+.*)(?=.*[a-z]+.*)[+%$#@\*\(\)\{\}\!\_\-0-9a-zA-Z]{8,}/
    return !_.isEmpty(pass) && (pass && pass.trim().length <= 32) && regex.test(pass)
  }
}