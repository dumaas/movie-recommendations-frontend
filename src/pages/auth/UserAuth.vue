<template>
	<div>
    <base-dialog :show="!!error" title="An error occurred." @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
		<h2>Log in!</h2>
		<login-form @save-data="saveData"></login-form>
	</div>
</template>

<script>
  import LoginForm from '../../components/auth/LoginForm.vue'

  export default {
    components: {
      LoginForm,
    },
    data() {
      return {
        isLoading: false,
        error: null,
      };
    },
    methods: {
      async saveData(data, mode) {
        this.isLoading = true;

        try {
          if (mode === 'login') {
            await this.$store.dispatch('login', data);
          } else {
            await this.$store.dispatch('signup', {
              first_name: data.first,
              username: data.username,
              password1: data.password,
              password2: data.password,
              email: data.email,
            })
          }
          const redirectUrl = '/' + (this.$route.query.redirect || 'movies')
          this.$router.replace(redirectUrl)
        } catch(err) {
          if (err.message.includes("400")) {
            this.error = "Incorrect email or password. Please verify credentials and try again."
          } else {
            this.error = err.message || 'Failed to authenticated, try again later!';
          }
        }

        this.isLoading = false;
      },
      handleError() {
        this.error = null;
      },
    },
  }
</script>