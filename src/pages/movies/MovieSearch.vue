<template>
  <div>
    <div v-if="query !== undefined">
      <h1 class="mb-4 fst-italic">Showing results for '{{ query }}'...</h1>
      <base-search></base-search>
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
    <div v-else>
      <h1>No search query provided.</h1>
      <p>Please use the above search bar to find a movie!</p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MovieItem from '../../components/movies/MovieItem.vue'

  export default {
    props: ['movies', 'query'],
    components: {
      MovieItem,
    },
    computed: {
      ...mapGetters({
          getMovies: 'movies/movies'
        })
    },
    created() {
      // console.log(query)
    }
  }
</script>
