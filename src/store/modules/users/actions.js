import { axiosDjango } from '../../../axios'

export default {
  async loadUsers(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return
    }

    const response = await axiosDjango.get('users/')
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to fetch users!')
        throw error
      })

    const users = []

    for (const key in response.data) {
      const user = {
        id: response.data[key].id,
        email: response.data[key].email,
        first: response.data[key].first_name,
        ratings: await context.dispatch('formatRatings', {response: response.data[key].ratings}),
      }
      users.push(user)
    }
    console.log('users', users)

    context.commit('setUsers', users)
    context.commit('setFetchTimestamp')
  },
  async getRatings(context, payload) {
    let url = 'users/' + payload.id

    const response = await axiosDjango.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to fetch users!')
        throw error
      })

    let ratings = await context.dispatch('formatRatings', {response: response.data.ratings})

    return ratings
  },
  async formatRatings(context, payload) {
    let results = payload.response

    if (results === '') {
      return ""
    }

    results = results.split(',')

    let ratings = []
    for (const key in results) {
      let rating = {
        id: parseInt(results[key].split(':')[0]),
        rating: parseFloat(results[key].split(':')[1]),
      }
      ratings.push(rating)
    }
    // sort descending by rating
    return ratings.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
  },
  async loadUser(context, payload) {
    let url = 'users/' + payload.userId

    const response = await axiosDjango.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to fetch users!')
        throw error
      })

    let user = {
      id: response.data.id,
      email: response.data.email,
      first: response.data.first_name,
      ratings: await context.dispatch('formatRatings', {response: response.data.ratings}),
    }

    context.commit('setUsers', user)
  },
  async updateRating(context, payload) {
    let ratings = await context.dispatch('getRatings', {id: payload.id})
    let string = ""
    let found = false
    if (ratings !== '') {
      ratings.forEach((rating) => {
        if (rating.id === payload.movieId) {
          rating.rating = payload.rating
          found = true
        }
      })
      // rating not present
      if (found === false) {
        ratings.push({id: payload.movieId, rating: payload.rating})
      }
      for (const key in ratings) {
        string += ratings[key].id + ':' + ratings[key].rating + ','
      }
      string = string.slice(0, -1)  // remove trailing comma
    } else {
      string += payload.movieId + ':' + payload.rating
    }

    let url = 'users/' + payload.id + '/'

    const response = await axiosDjango.put(url, {ratings: string})
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to fetch users!')
        throw error
      })

    console.log(response.data)
  },
}