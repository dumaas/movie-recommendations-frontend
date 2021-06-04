<template>
  <div>
    <base-dialog :show="isLoading" title="Loading recommendations..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-search></base-search>
    <div v-if="!isLoading">
      <h1 class="mb-4 fst-italic">Movie suggestions based on <u>{{ title }}</u></h1>
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
    props: ['id'],
    components: {
      MovieItem,
    },
    data() {
      return {
        isLoading: true,
        title: null,
        image: null,
        overview: null,
        date: null,
        dataset: null,
      }
    },
    computed: {
      ...mapGetters({
          getMovies: 'movies/movies'
        })
    },
    created() {
      this.loadMovie()
    },
    methods: {
      async loadMovie() {
        try {
          await this.$store.dispatch('movies/loadMovie', {id: this.id})
        } catch (error) {
          this.error = error.message || 'Something went wrong!'
        }
        this.setMovie()
        this.getSuggestions()
      },
      async getSuggestions() {
        try {
          await this.$store.dispatch('movies/getSuggestions', {tmdbId: this.id, mode: this.getMode()})
        } catch (error) {
          this.error = error.message || 'Something went wrong!'
        }
        this.isLoading = false
      },
      setMovie() {
        // this way, we only call the getter once
        let movie = this.getMovies
        this.title = movie.title
        this.image = movie.image
        this.overview = movie.overview
        this.date = movie.date
        this.dataset = movie.dataset
        if (this.mode == null) {
          this.mode = this.getMode()
        }
      },
      getMode() {
        return (this.dataset) ? 'django' : 'tmdb'
      },
    },
  }
</script>

<style scoped>
</style>
