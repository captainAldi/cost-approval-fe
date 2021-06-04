<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'dialogLoading',
    computed: {
      ...mapGetters({
        status : 'dialog/status',
      }),
      dialog: {
        get () {
          return this.status
        },
        set (value) {
          this.setDialog({
            status : value,
          })
        }
      },
    },
    methods: {
      ...mapActions({
        setAlert  : 'dialog/set',
      }),
      close(){
        this.setDialog({
          status : false
        })
      }
    }
}
</script>