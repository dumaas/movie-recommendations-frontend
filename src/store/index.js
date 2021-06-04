import { createStore } from 'vuex'
import authModule from './modules/auth/index.js'
import moviesModule from './modules/movies/index.js'
import usersModule from './modules/users/index.js'

const store = createStore({
  modules: {
    auth: authModule,
    movies: moviesModule,
    users: usersModule,
  },
});

export default store;
