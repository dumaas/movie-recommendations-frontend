export default {
  movies(state) {
    return state.movies
  },
  movie(state, id) {
    console.log(state.movies, id)
    return state.movies
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch
    if (!lastFetch) {
      return true
    }
    const currentTimeStamp = new Date().getTime()
    return (currentTimeStamp - lastFetch) / 10000 > 60
  },
};
