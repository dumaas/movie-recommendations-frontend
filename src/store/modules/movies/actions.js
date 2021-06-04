import { axiosMovies, axiosDjango } from '../../../axios'

export default {
  async loadTrendingMovies(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return
    }

    let page = 1
    let movies = []
    while (movies.length < 10) {

      let url = 'movie/top_rated?&page=' + page

      const response = await axiosMovies.get(url)
        .catch(err => {
          console.log(err)
          const error = new Error(err.message || 'Failed to load movies!')
          throw error
        })

      let results = response.data.results

      for (const key in results) {
        const movie = {
          id: results[key].id,
          title: results[key].title,
          date: results[key].release_date,
          image: 'http://image.tmdb.org/t/p/w300' + results[key].poster_path,
          dataset: await context.dispatch('validateDataset', {id: results[key].id, date: results[key].release_date})
        }

        // only display the best movies in dataset
        if (movie.dataset === true) {
          movies.push(movie)
        }

        if (movies.length == 10) {
          break
        }
      }
      page++
    }

    await context.commit('setMovies', movies)
  },
  async loadMovie(context, payload) {
    let url = 'movie/' + payload.id

    const response = await axiosMovies.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to load movies!')
        throw error
      })

    const movie = {
      id: response.data.id,
      title: response.data.title,
      overview: response.data.overview,
      date: response.data.release_date,
      image: 'http://image.tmdb.org/t/p/w300' + response.data.poster_path,
      dataset: await context.dispatch('validateDataset', {id: response.data.id, date: response.data.release_date})
    }

    context.commit('setMovies', movie)
  },
  async loadRatedMovies(context, payload) {
    let ratings = payload.ratings
    let movies = []
    for (const key in ratings) {
      let url = 'movie/' + ratings[key].id

      const response = await axiosMovies.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to load movies!')
        throw error
      })

      let movie = {
        id: response.data.id,
        title: response.data.title,
        overview: response.data.overview,
        date: response.data.release_date,
        image: 'http://image.tmdb.org/t/p/w300' + response.data.poster_path,
        dataset: await context.dispatch('validateDataset', {id: response.data.id, date: response.data.release_date}),
        rating: ratings[key].rating,
      }
      movies.push(movie)
    }
    await context.commit('setMovies', movies)
  },
  async getSuggestions(context, payload) {
    let page = 1
    let movies = []
    while (movies.length < 10) {
      let url = (payload.mode == 'django') ? 'endpoints/movie_predictor/predict' : 'movie/' + payload.tmdbId + '/recommendations?&page=' + page

      let tmdbId = parseInt(payload.tmdbId)

      let response = null
      let results = null

      if (payload.mode == 'django') {
        response = await axiosDjango.post(url, {"tmdbId": tmdbId},
          ).catch(err => {
            console.log(err)
            const error = new Error(err.message || 'Failed to load movies!')
            throw error
          })
        results = response.data.movies
      } else {
        response = await axiosMovies.get(url)
          .catch(err => {
            console.log(err)
            const error = new Error(err.message || 'Failed to load movies!')
            throw error
          })
        results = response.data.results
      }

      for (const key in results) {
        let movie = {
          id: (payload.mode == 'django') ? results[key].tmdbId : results[key].id,
          title: results[key].title,
          date: results[key].release_date,
          image: 'http://image.tmdb.org/t/p/w300' + results[key].poster_path,
        }

        if (payload.mode == 'django') {
          movie = await context.dispatch('validateMovie', {title: results[key].original_title, date: movie.date})
        }

        // check for duplicates
        let seen = new Set(movies.map(movie => movie.title))
        if (seen.size < movies.length) {
          console.log('found duplicate')
        }

        // incase TMDB is missing metadata (rare)
        if (movie.image != 'null') {
          movies.push(movie)
        }

        if (movies.length == 10) {
          break
        }
      }
      page++
    }

    context.commit('setMovies', movies)
  },
  async submitSearch(context, payload) {
    let url = 'search/movie?&query=' + payload.query.replace(/ /g, '+')

    const response = await axiosMovies.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to load movies!')
        throw error
      })

    let results = response.data.results

    let movies = []

    for (const key in results) {
      let movie = {
        id: results[key].id,
        title: results[key].title,
        date: results[key].release_date,
        image: (results[key].poster_path == null) ? 'null' : 'http://image.tmdb.org/t/p/w300' + results[key].poster_path,
      }

      // incase TMDB is missing metadata (rare)
      if (movie.image != 'null') {
        movies.push(movie)
      }

      if (movies.length == 10) {
        break
      }
    }

    context.commit('setMovies', movies)
  },
  async validateMovie(context, payload) {
    let url = 'search/movie?&query=' + payload.title.replace(/ /g, '+') + '&primary_release_year=' + payload.date.split('-')[0]

    const response = await axiosMovies.get(url)
      .catch(err => {
        console.log(err)
        const error = new Error(err.message || 'Failed to load movies!')
        throw error
      })

    let results = response.data.results
    if (results.length == 0) {
      return {image: 'null'}
    }

    let fixedData = null

    for (const key in results) {
      if (results[key].original_title.toLowerCase() === payload.title.toLowerCase() ||
          results[key].release_date === payload.date) {
        fixedData = {
          id: results[key].id,
          title: results[key].title,
          date: results[key].release_date,
          image: (results[key].poster_path == null) ? 'null' : 'http://image.tmdb.org/t/p/w300' + results[key].poster_path,
        }
        break
      }
    }

    // movie not found (rare)
    if (fixedData === null) {
      fixedData = {image: 'null'}
    }
    return fixedData
  },
  async validateDataset(context, payload) {
    let result = (new Date(payload.date) > new Date(2017, 6)) ? false : true

    // further check if movie in dataset
    if (result) {
      let url = 'endpoints/movie_predictor/predict'

      const response = await axiosDjango.post(url, {"tmdbId": payload.id},
        ).catch(err => {
          console.log(err)
          const error = new Error(err.message || 'Failed to load movies!')
          throw error
        })
      result = response.data.movies instanceof Array ? true : false
    }
    return result
  },
}