export default {
  /**
   * Getter e setter de regras do usuario
   * nivel de acesso no local history
   */
  getRule() {
    const data = localStorage.getItem('open-planner@rule')

    return data || 'anonymous'
  },

  setRule(data) {
    localStorage.setItem('open-planner@rule', data)
  },

  /**
   * Getter e setter de dados do usuario
   * logado
   */
  getUser() {
    let user = JSON.parse(localStorage.getItem('open-planner@user'))

    if (!user) {
      user = {
        userType: 'anonymous'
      }
    }

    return user
  },

  setUser(data) {
    localStorage.setItem('open-planner@user', JSON.stringify(data))
  },

  setLogged(bool) {
    localStorage.setItem('open-planner@logged', JSON.stringify(bool))
  },

  isLogged() {
    localStorage.getItem('open-planner@logged')
  },

  /**
   * Getter e setter do token do usuario
   * logado
   */
  getToken() {
    return localStorage.getItem('open-planner@token')
  },

  setToken(data) {
    localStorage.setItem('open-planner@token', data)
  },

  /**
   * Getter e setter de linguagem
   */
  getLocale() {
    const locale = localStorage.getItem('locale')
    return locale || 'pt-br'
  },

  setLocale(data) {
    localStorage.setItem('localforgetPassword', data)
  },

  setForgetPassword(bool) {
    let user = JSON.parse(localStorage.getItem('open-planner@user'))

    user.forgetPassword = bool
    localStorage.setItem('open-planner@user', JSON.stringify(user))
  },

  isFirstAccess() {
    return this.getUser().newUser
  },

  signOut: () => {
    localStorage.clear()
  }
}