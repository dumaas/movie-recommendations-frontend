import { axiosDjango } from '../../../axios'

let timer

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    })
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup',
    })
  },
  async auth(context, payload) {
    const mode = payload.mode
    let url = 'dj-rest-auth/login/'

    if (mode === 'signup') {
      url = 'dj-rest-auth/registration'
    }

    // for debugging
    if (payload.username === 'christiangonzalezblack_gmail') {
      payload.username = 'dumaas'
    }

    const response = await axiosDjango.post(url, {
      ...payload,
    }).catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to authenticate. Check your login data!')
        throw error
      })

    let user = {
      id: response.data.user.pk,
      email: response.data.user.email,
      first: response.data.user.first_name,
      ratings: await context.dispatch('users/getRatings', {id: response.data.user.pk}),
      token: 'Bearer ' + response.data.access_token,
    }

    // calculate token expiration
    let current = new Date()
    let token_expiration = new Date(current.getTime() + 3600000)
    let expiresIn = +token_expiration - new Date().getTime()

    // set id for localStorage
    context.commit('setUserId', { id: user.id })
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', user.token)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('tokenExpiration', token_expiration)

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn)

    context.commit('setUser', user)
  },
  tryLogin(context) {
    let user = {
      id: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      token: localStorage.getItem('token'),
    }
    let tokenExpiration = localStorage.getItem('tokenExpiration')
    let expiresIn = 0

    if (tokenExpiration) {
      tokenExpiration = new Date(tokenExpiration)
      expiresIn = +tokenExpiration - new Date().getTime()
    }

    if (expiresIn < 60000) {
      return
    }

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn)

    if (user.token) {
      context.commit('setUser', user)
    }
  },
  logout(context) {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    localStorage.removeItem('userId')

    clearTimeout(timer)

    context.commit('setUser', {
      token: null,
    })
  },
  autoLogout(context) {
    context.dispatch('logout')
    context.commit('setAutoLogout')
  },
}