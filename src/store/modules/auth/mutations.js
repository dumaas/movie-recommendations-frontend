export default {
  setUser(state, payload) {
    state.token = payload.token
    state.email = payload.email
    state.id = payload.id
    state.first = payload.first
    state.didAutoLogout = false
  },
  setUsers(state, payload) {
    state.users = payload
  },
  setAutoLogout(state) {
    state.didAutoLogout = true
  },
  setUserId(state, payload) {
    state.id = payload.id
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime()
  },
}