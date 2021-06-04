<template>
  <form @submit.prevent="submitForm">
    <div v-if="this.mode === 'signup'" class="form-control" :class="{invalid: !userName.isValid}">
      <label for="name">First Name</label>
      <input type="text" id="name" v-model.trim="userName.val" @blur="clearValidity('userName')" />
      <p class="errors" v-if="!userName.isValid">Please provide a valid name.</p>
    </div>
    <div class="form-control" :class="{invalid: !userEmail.isValid}">
      <label for="email">Email</label>
      <input type="email" id="email" v-model.trim="userEmail.val" @blur="clearValidity('userEmail')" />
      <p class="errors" v-if="!userEmail.isValid">Please provide a valid email address.</p>
    </div>
    <div class="form-control" :class="{invalid: !userPassword.isValid}">
      <label for="password">Password</label>
      <input type="password" id="password" v-model.trim="userPassword.val" @blur="clearValidity('userPassword')" />
      <p class="errors" v-if="!userPassword.isValid">Password must be longer than 6 characters.</p>
    </div>
    <p class="errors" v-if="!formIsValid">Please fix the above errors and submit again.</p>
    <base-button type="submit">{{ submitButtonCaption }}</base-button>
    <button type="button" class="btn btn-secondary" @click="switchAuthMode">{{ switchModeButtonCaption }}</button>
  </form>
</template>

<script>
  export default {
    emits: ['save-data'],
    data() {
      return {
        userName: {
          val: '',
          isValid: true,
        },
        userEmail: {
          val: '',
          isValid: true,
        },
        userPassword: {
          val: '',
          isValid: true,
        },
        formIsValid: true,
        mode: 'login',
      }
    },
    computed: {
      submitButtonCaption() {
        if (this.mode === 'login') {
          return 'Login'
        } else {
          return 'Sign Up'
        }
      },
      switchModeButtonCaption() {
        if (this.mode === 'login') {
          return 'Sign Up Instead'
        } else {
          return 'Login Instead'
        }
      },
    },
    methods: {
      clearValidity(input) {
        this[input].isValid = true
      },
      validateForm() {
        this.formIsValid = true

        let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (this.userName.val === '' && this.mode === 'signup') {
          this.userName.isValid = false
          this.formIsValid = false
        }
        if (this.userEmail.val === '') {
          this.userEmail.isValid = false
          this.formIsValid = false
        }
        if (!this.userEmail.val.match(emailFormat)) {
          this.userEmail.isValid = false
          this.formIsValid = false
        }
        if (this.userPassword.val.length < 6) {
          this.userPassword.isValid = false
          this.formIsValid = false
        }
      },
      submitForm() {
        this.validateForm()

        if (!this.formIsValid) {
          return
        }

        let user = this.userEmail.val
        let newUsername = user.replace('@', '_').substring(0, user.indexOf('.com'))

        const formData = {
          username: newUsername,
          email: this.userEmail.val,
          password: this.userPassword.val,
        }

        if (this.mode === 'signup') {
          formData.first = this.userName.val
        }

        this.$emit('save-data', formData, this.mode)
      },
      switchAuthMode() {
        if (this.mode === 'login') {
          this.mode = 'signup'
        } else {
          this.mode = 'login'
        }
      },
    },
  }
</script>