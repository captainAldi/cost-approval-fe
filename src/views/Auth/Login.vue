<template>
  <div>
    <v-container fluid>
      <center>
        <h1>Login Page</h1>
        <v-btn
          color="blue-grey"
          class="ma-2 white--text"
          :href="googleLoginUrl"
        >
          <v-icon
            left
            dark
          >
            mdi-google
          </v-icon>

          Sign In
        </v-btn>
      </center>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      googleLoginUrl: '',
      base_api_url: process.env.VUE_APP_BASE_API_ENDPOINT,
      dataRoute: ''
    }
  },
  mounted() {
    this.getGoogleLoginUrl()
  },
  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
    }),
    async getGoogleLoginUrl() {
      try {
        const response = await axios.get(this.base_api_url + '/oauth/google/login')
        this.googleLoginUrl = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style>
</style>