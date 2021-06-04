<template>
  <div>
    <v-container fluid>
      <center>
        <h1>Login Google Callback</h1>
      </center>
      <br/>

      <section v-if="user.user && errorStatus !== true">
        <center>
          <h2>Welcome</h2>
        </center>

        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>

          <v-img
            class="white--text align-end"
            height="200px"
            :src="user.user.photo"
          >
          </v-img>

          <v-card-text class="text--primary">
            <div>{{user.user.email}}</div>

            <div>{{user.user.name}}</div>
          </v-card-text>

        </v-card>
       
      </section>

      <section v-if="errorStatus === true">
        <center>
          <h2>{{errorMessage}}</h2>
        </center>
      </section>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'loginGoogle',
  data() {
    return {
      base_api_url: process.env.VUE_APP_BASE_API_ENDPOINT,
      loading: true,
      errorStatus: false,
      errorMessage: '',
      data: {}
    }
  },
  mounted() {
    this.getGoogleCallback()
  },
  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest',
      prevUrl : 'prevUrl/prevUrl'
    }),
  },
  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
    }),
    async getGoogleCallback() {
      try {
        const dataParam = this.$route.query
        const queryString = Object.keys(dataParam).map(key => key + '=' + dataParam[key]).join('&');
        const response = await axios.get(this.base_api_url + '/oauth/google/callback?' + queryString)
        this.setAuth(response.data)
        let sesiLogin = moment().add('15', 'minutes').format()
        localStorage.setItem('sesiLogin', sesiLogin);
        if(this.prevUrl.length > 0) this.$router.push(this.prevUrl)
      } catch (error) {
        this.errorStatus = true
        if ( error.response.status === 401 ) {
          this.errorMessage = 'Gunakan Email Alterra atau BSA !' 
          this.setAlert({
            status : true,
            color  : 'error',
            text  : 'Gunakan Email Alterra / BSA !',
          })
        } else if ( error.response.status === 500 ) {
          this.errorMessage = 'Internal Error, Please TryAgain !' 
          this.setAlert({
            status : true,
            color  : 'error',
            text  : '500 Internal Error',
          })
        }
      }
    },
  },
}
</script>

<style>
</style>