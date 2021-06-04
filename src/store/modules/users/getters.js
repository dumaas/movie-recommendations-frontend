export default {
  users(state) {
    return state.users
  },
  hasUsers(state) {
    return state.users && state.users.length > 0
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch
    if (!lastFetch) {
      return true
    }
    const currentTimeStamp = new Date().getTime()
    return (currentTimeStamp - lastFetch) / 1000 > 60
  },
}
