export default {
  addUser(state, payload) {
    // check for duplicate id's
    state.users.push(payload)
  },
  setUsers(state, payload) {
    state.users = payload
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime()
  },
}