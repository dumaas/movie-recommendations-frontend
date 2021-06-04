<template>
	<div>
		<base-dialog :show="isSubmitting" title="Saving your rating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
		<div v-if="isLoggedIn">
			<div v-if="rating && !setRating">
				<p>Your rating: {{ rating }}</p>
				<button type="button" class="btn btn-secondary" @click="toggleRatingForm">Change Rating</button>
			</div>
			<div v-else>
				<form @submit.prevent="submitForm">
					<div class="form-control">
					<label for="rating">Your Rating (1-5):</label>
					<input type="number" min="1" max="5" step=".5" id="rating" v-model.trim="userRating" />
				</div>
				<button type="submit" class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-secondary" @click="toggleRatingForm">Cancel</button>
				</form>
			</div>
		</div>
		<div v-else>
			<base-button class="btn btn-secondary" link to="/login">Login to rate!</base-button>
		</div>
	</div>
</template>

<script>
  import { mapGetters } from 'vuex'

	export default {
		props: ['id'],
		data() {
			return {
				isLoading: false,
				isSubmitting: false,
				userId: null,
				rating: null,
				setRating: true,
        formIsValid: true,
				userRating: null,
			}
		},
		computed: {
			...mapGetters({
        isLoggedIn: 'isAuthenticated',
        getUser: 'users/users',
			}),
		},
		created() {
			this.getUserRating()
		},
		methods: {
			getUserRating() {
				let userId = localStorage.getItem('userId')
				if (userId) {
					this.userId = userId
					this.setRating = false
					this.loadUser()
				}
			},
			async loadUser() {
				this.isLoading = true
				try {
          await this.$store.dispatch('users/loadUser', {userId: this.userId})
				} catch (error) {
          this.error = error.message || 'Something went wrong!'
				}
				await this.setUser()
			},
			async setUser() {
				let user = this.getUser
				if (user.ratings !== '') {
					user.ratings.forEach((rating) => {
						if (rating.id === parseInt(this.id)) {
							this.rating = parseFloat(rating.rating)
						}
					})
				}
				this.isLoading = false
			},
			toggleRatingForm() {
				if (this.setRating === false) {
					this.setRating = true
				} else {
					this.setRating = false
				}
			},
			async submitForm() {
				this.isSubmitting = true
				this.userRating = parseFloat(this.userRating)
				const formData = {
					id: parseInt(this.userId),
					movieId: parseInt(this.id),
					rating: this.userRating,
				}
				try {
          await this.$store.dispatch('users/updateRating', formData)
				} catch (error) {
          this.error = error.message || 'Something went wrong!'
				}
				// hard-coded for simplicity
				this.rating = this.userRating
				this.toggleRatingForm()
				this.isSubmitting = false
			},
		},
	}
</script>
