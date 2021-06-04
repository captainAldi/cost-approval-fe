<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'App',
  components: {

  },
  mounted() {

    this.getTahun()
    this.getThemeDataLS()
    this.checkExpiration()

  },

  data: () => ({

    drawer: false,
    tahun: '',
    app_theme_key: process.env.VUE_APP_LS_THEME_KEY,

  }),

  computed: {
    ...mapGetters({
      user: 'auth/user',
      guest: 'auth/guest',
    }),
    goDark: {
      get() {
        const theme = JSON.parse(localStorage.getItem(this.app_theme_key))
        return theme
      },
      set(v) {
        this.$vuetify.theme.dark = v
        localStorage.setItem(this.app_theme_key, v)
      }
    },
  },

  methods: {
    getTahun() {
      this.tahun = new Date().getFullYear()
    },
    async logOutSSO() {
      await localStorage.clear()
      this.$router.go(0)
    },
    getThemeDataLS() {
      const theme = localStorage.getItem(this.app_theme_key);
      if (theme) {
          if (theme == "true") {
              this.$vuetify.theme.dark = true;
          } else {
              this.$vuetify.theme.dark = false;
          }
      }
    },
    checkExpiration() {
      if(this.guest === false) {
        //Get nilai expiresIn
        const expiresIn = localStorage.getItem('sesiLogin')
        const checkTime = moment().format()
        console.log(expiresIn)
        console.log(checkTime)
        //Cek nilai nya
        if (moment(checkTime).isAfter(expiresIn)) {
          this.logOutSSO()
        } 
      }
    }

  }

};

</script>
