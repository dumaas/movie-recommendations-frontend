<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Loading..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-search></base-search>
    <div v-if="!isLoading">
      <img :src="image" class="rounded float-start">
      <div class="offset-md-3">
        <h1 class="mb-4 fst-italic">{{ title }} ({{ date.split('-')[0] }})</h1>
        <p class="fs-4">{{ overview }}</p>
        <MovieRating :id=id />
        <br>
        <base-button link :to="{ name: 'suggest', params: {id: id}}">Get recommendations!</base-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MovieRating from '../../components/movies/MovieRating.vue'

  export default {
    props: ['id'],
    components: {
      MovieRating,
    },
    data() {
      return {
        isLoading: true,
        error: null,
        title: null,
        image: null,
        overview: null,
        date: null,
        dataset: null,
      }
    },
    computed: {
      ...mapGetters({
          movie: 'movies/movies'
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
        this.isLoading = false
      },
      setMovie() {
        // this way, we only call the getter once
        let movie = this.movie
        this.title = movie.title
        this.image = movie.image
        this.overview = movie.overview
        this.date = movie.date
        this.dataset = movie.dataset
      },
      handleError() {
        this.error = null
      },
    },
  }
</script>
