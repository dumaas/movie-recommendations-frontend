<template>
	<div>
		<base-dialog :show="isLoading" title="Loading ratings..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
		<div v-if="!isLoading">
			<div v-if="ratings === ''">
				<h1 class="mb-4 fst-italic">{{ first }}, rate some movies and then come back here!</h1>
			</div>
			<div v-else>
				<h1 class="mb-4 fst-italic">{{ first }}, here are your movie ratings...</h1>
				<div class="row" id="gallery">
					<MovieItem
						class="col-12 col-sm-6 col-lg-3"
						v-for="movie in getMovies"
						:key="movie.id"
						:id="movie.id"
						:title="movie.title"
						:date="movie.date"
						:image="movie.image"
						:rating="movie.rating"
					/>
				</div>
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
				id: localStorage.getItem('userId'),
				email: "",
				first: "",
				ratings: "",
				isLoading: true,
			}
		},
		computed: {
      ...mapGetters({
          getUser: 'users/users',
          getMovies: 'movies/movies',
        })
    },
		created() {
			this.loadUser()
		},
		methods: {
			async loadUser() {
				try {
          await this.$store.dispatch('users/loadUser', {userId: this.id})
				} catch (error) {
          this.error = error.message || 'Something went wrong!'
				}
				await this.setUser()
			},
			async setUser() {
				let user = this.getUser
				this.email = user.email
				this.first = user.first
				this.ratings = user.ratings
				await this.loadRatedMovies()
			},
			async loadRatedMovies() {
				try {
          await this.$store.dispatch('movies/loadRatedMovies', {ratings: this.ratings})
				} catch (error) {
          this.error = error.message || 'Something went wrong!'
				}
				setTimeout(() => {
					this.isLoading = false
				}, 1000)
			}
		},
	}
</script>
