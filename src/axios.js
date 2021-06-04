import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json'

let axiosMovies = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
     common: {
       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzU1NTdmZjI0ODg1NTBkNjE4YmVhYzJiZjU4MzRjMiIsInN1YiI6IjYwYTQ0NDI0OWE5ZTIwMDAyOTU1OWUyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S8dcyqjW3mX7W0Y04yk4WQJiLiLZO9333hb-PQFQLY0',
    }
  }
})

let axiosDjango = axios.create({
  baseURL: 'http://localhost:8000/',
})

export {
  axiosMovies,
  axiosDjango,
}
