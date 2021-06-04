import { createRouter, createWebHistory } from 'vue-router'
import store from './store/index.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/movies'
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('./pages/movies/MovieList.vue'),
      props: true,
      meta: {title: 'Top Movies'},
    },
    {
      path: '/movies/:id',
      component: () => import('./pages/movies/MovieDetail.vue'),
      props: true,
      meta: {title: 'Movie Detail'},
    },
    {
      path: '/movies/:id/suggest',
      name: 'suggest',
      props: true,
      component: () => import('./pages/movies/RecommendMovies.vue'),
      meta: {title: 'Recommendations'},
    },
    {
      path: '/movies/search',
      name: 'search',
      component: () => import('./pages/movies/MovieSearch.vue'),
      props: true,
      meta: {title: 'Search'},
      beforeEnter: (to, from, next) => {
        console.log('to', to.params.query)
        if (to.params.query === undefined) {
          next('/movies')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      meta: {requiresUnauth: true, title: 'Login'},
      component: () => import('./pages/auth/UserAuth.vue'),
    },
    {
      path: '/ratings',
      meta: {requiresAuth: true, title: 'My Ratings'},
      component: () => import('./pages/users/UserRatings.vue'),
    },
    {
      path: '/:notFound(.*)',
      name: 'notFound',
      component: () => import('./pages/NotFound.vue'),
      meta: {title: 'Not Found'},
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/movies')
  } else {
    next()
  }
})

export default router
