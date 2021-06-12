<template>
  <div class="approve-token">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        lg="6"
        md="8"
        align-self="center"
      >        
      
        <v-card
          elevation="4"
          class="mx-auto mt-5 "
          max-width="80%"
          v-if="statusApproval == 'loading'"
        >
          <v-card-title class="justify-center">Approval on Process</v-card-title>
          <v-divider></v-divider>
          <v-card-text>

            <center>
              <v-progress-circular
                :size="70"
                :width="7"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </center>

          </v-card-text>
          <v-card-subtitle>            
            Please Wait ...
          </v-card-subtitle>
        </v-card>

        <v-card
          elevation="4"
          class="mx-auto mt-5 "
          max-width="80%"
          v-else-if="statusApproval == 'success'"
        >
          <v-card-title class="justify-center">Approval Status</v-card-title>
          <v-divider></v-divider>
          <v-card-text>

            <center>
              <v-icon
                :size="70"
                color="green darken-2"
              >
                mdi-check-circle-outline
              </v-icon>
            </center>

          </v-card-text>
          <v-card-subtitle>            
            Thank You !
          </v-card-subtitle>
        </v-card>

        <v-card
          elevation="4"
          class="mx-auto mt-5 "
          max-width="80%"
          v-else
        >
          <v-card-title class="justify-center">Approval Status</v-card-title>
          <v-divider></v-divider>
          <v-card-text>

            <!-- Alert Jika Gagal -->
            <v-alert 
              :type="alertObject.type"
              v-model="alertObject.status"
              dismissible
            >
              <li
                v-for="(value, key) of alertObject.message"
                :key="key"
              >
                {{value}}
              </li>
            </v-alert>

            <center>
              <v-icon
                :size="70"
                color="green darken-2"
              >
                mdi-alert-circle-outline
              </v-icon>
            </center>

          </v-card-text>
          <v-card-subtitle>            
            Please Contact Infra Team !
          </v-card-subtitle>
        </v-card>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'approve-token',
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      alertObject: {
        type: 'success',
        message: {},
        status: false
      },
      remember_token: '',
      statusApproval: 'loading'
    }
  },

  mounted() {
    this.ambilDataUrl()
    this.approveData()
  },

   methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setDialog : 'dialog/set',
      setAuth   : 'auth/set'
    }),

    ambilDataUrl() {
      this.remember_token = this.$route.params
    },

    async approveData() {
      try {


        await axios.get(this.api_url +'/otr/bill/approve/' + this.remember_token.token)

        this.statusApproval = 'success'

        this.setAlert({
          status : true,
          color  : 'success',
          text  : 'Tagihan Berhasil di Approve !',
        })

      } catch (error) {
        
        this.statusApproval = 'error'

        this.setAlert({
          status : true,
          color  : 'error',
          text  : 'Ada Masalah di Server !',
        })

        this.alertObject.status = true
        this.alertObject.type = 'error'
        this.alertObject.message = error.response.data
        
      }
    }

   }

}
</script>

<style scoped>
.approve-token {
  background-color: #54c2cc;
  height: 100%;
}
</style>