<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Loading cool movies..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <h1 class="mb-4 fst-italic">Top Movies</h1>
    <base-search></base-search>
    <div v-if="!isLoading">
      <div class="row" id="gallery">
        <MovieItem
          class="col-12 col-sm-6 col-lg-3"
          v-for="movie in getMovies"
          :key="movie.id"
          :id="movie.id"
          :title="movie.title"
          :date="movie.date"
          :image="movie.image"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MovieItem from '../../components/movies/MovieItem.vue'

  export default {
    components: {
      MovieItem,
    },
    data() {
      return {
        isLoading: true,
        error: null,
      }
    },
    computed: {
      ...mapGetters({
          getMovies: 'movies/movies',
        })
    },
    created() {
      this.loadTrendingMovies(),
      this.loadUsers()
    },
    methods: {
      async loadTrendingMovies(refresh = false) {
        try {
          await this.$store.dispatch('movies/loadTrendingMovies', {forceRefresh: refresh})
        } catch (error) {
          this.error = error.message || 'Something went wrong!'
        }
        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      },
      async loadUsers(refresh = false) {
        try {
          await this.$store.dispatch('users/loadUsers', {forceRefresh: refresh})
        } catch (error) {
          this.error = error.message || 'Something went wrong!'
        }
      },
      handleError() {
        this.error = null
      },
    },
  }
</script>

<style scoped>
</style>
