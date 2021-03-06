<template>
  <div>
    <v-container fluid>
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
            <template v-for="item in value"> {{item}} </template>
          </li>
        </v-alert>

        <!-- Judul -->
        <h1>Data Tagihan</h1>

        <!-- Filter -->
        <section>
          <h4>Filters</h4>

          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-select
                v-model="statusBill"
                :items="itemsStatusBill"
                item-text="title"
                item-value="nilai"
                label="Status"
                single-line
                required
                @change="getAllBills"
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </section>

        <!-- Table -->
        <v-data-table
          :headers="headers"
          :items="dataBills"
          :search="search"
          :loading="tableLoading"
          mobile-breakpoint="0"
          class="elevation-4 mt-5"
        >
          <template v-slot:item="row">
              <tr>
                <td>{{row.index + 1}}</td>
                <td>{{row.item.judul}}</td>
                <td>{{row.item.deskripsi}}</td>
                <td>
                  <v-btn
                    small
                    class="white--text"
                    :color="row.item.status == 'Waiting' ? 'error' : 'success'"
                  >
                    {{row.item.status}}
                  </v-btn>
                </td>
                <td>{{row.item.bu}}</td>
                <td>{{row.item.business_initiative}}</td>
                <td>{{row.item.nama_pt}}</td>
                <td>{{row.item.tanggal_jatuh_tempo}}</td>
                <td>
                  {{new Intl.NumberFormat('id', { style: 'currency', currency: 'IDR' }).format(row.item.jumlah_tagihan)}}
                </td>
                <td>
                  <v-chip
                    :color="row.item.transaksi_berulang == 'Tidak' ? 'error' : 'primary'"
                    dark
                    x-small
                  >
                    {{row.item.transaksi_berulang}}
                  </v-chip>
                </td>

                <td>{{row.item.pengajus.name}}</td>

                <td v-if="row.item.approvers">
                  <ul>
                    <li v-for="(item, index) in row.item.approvers" :key="index">
                      {{item.email}} - 
                      <v-chip
                        :color="item.status == 'Waiting' ? 'error' : 'primary'"
                        dark
                        x-small
                      >
                        {{item.status}}
                      </v-chip>
                    </li>
                  </ul>
                </td>
                <td v-else>Belum Ada</td>

                <td v-if="row.item.finances">{{row.item.finances.email}}</td>
                <td v-else>Belum Ada</td>

                <td>{{row.item.updated_at}}</td>
                <td>
                    <v-btn
                      large
                      icon
                      color="primary" 
                      @click="detailData(row.item.file_inv)"
                    >
                        <v-icon dark>mdi-eye-circle</v-icon>
                    </v-btn>

                    <v-btn
                      large
                      icon
                      color="green" 
                      v-if="row.item.status == 'Waiting' && user.user.role == 'approver'"
                      @click="approveData(row.item)"
                    >
                        <v-icon dark>mdi-check-circle</v-icon>
                    </v-btn>
                </td>
              </tr>
          </template>
        </v-data-table>
        
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import 'vue-sweetalert2';

export default {
  name: 'DataBills',
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,
      search: '',
      tableLoading: false,
      headers: [
        { text: 'No', value: 'no', sortable: false },
        { text: 'Judul', value: 'judul' },
        { text: 'Deskripsi', value: 'deskripsi'  },
        { text: 'Status', value: 'status'  },
        { text: 'BU', value: 'bu'  },
        { text: 'BI', value: 'business_initiative'  },
        { text: 'PT', value: 'nama_pt' },
        { text: 'Tempo', value: 'tanggal_jatuh_tempo' },
        { text: 'Tagihan', value: 'tagihan' },
        { text: 'Berulang', value: 'transaksi_berulang' },
        { text: 'Nama Pengaju', value: 'pengajus.name'  },
        { text: 'E-Mail Approval', value: 'approvers' },
        { text: 'E-Mail Finance', value: 'finances' },
        { text: 'Updated At', value: 'updated_at' },
        
        { text: 'Actions', value: 'controls', sortable: false },
      ],
      dataBills: [],

      alertObject: {
        type: 'success',
        message: {},
        status: false
      },

      statusBill: 'waiting',
      itemsStatusBill: [
        { title: 'Waiting', nilai: 'waiting' },
        { title: 'Approved', nilai: 'approved' },
        { title: 'Paid', nilai: 'paid' },
      ]
    }
  },

  mounted() {
    this.getAllBills()
  },
  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),
  },
  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
      setDialog : 'dialog/set'
    }),
    
    async getAllBills() {
      try {

        this.tableLoading = true

        let config = {
          headers: {
            'Authorization': this.user.data.token
          }
        }

        let response = await axios.get(this.api_url + '/bill/get/' + this.statusBill, config)

        this.dataBills = response.data.data

        this.tableLoading = false
      } catch (error) {
        console.log(error.response.message)
      }
      
    },

    async detailData(e) {
      try {

        this.tableLoading = true

        let config = {
          headers: {
            'Authorization': this.user.data.token
          },
          responseType: 'blob'
        }

        // GetFile name
        const fullFileName = e
        // const fileName = fullFileName.split('.').shift()
        const fileName = fullFileName.replace(/\.[^/.]+$/, "")
        const fileExtension = fullFileName.split('.').pop()

        let response = await axios.get(`${this.api_url}/files/invoice-tagihan/${fileName}/${fileExtension}`, config)

        this.tableLoading = false

        // Create Blob from PDF to Stream
        const file = new Blob([response.data], {type: 'application/pdf'})

        // Create URL to File
        const fileURL = URL.createObjectURL(file)

        // Open URL to new Window
        window.open(fileURL)
      } catch (error) {
        console.log(error)
      }

    },

    async approveData(e) {
      const sw = await this.$swal.fire({
        title: 'Are you sure?',
        text: `Approve "${e.judul}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Pay it!'
      })

      if (sw.value) {
        try {
          
          this.tableLoading = true

          let config = {
            headers: {
              'Authorization': this.user.data.token
            },
          }

          let formData = new FormData()
          formData.append('_method', 'PATCH')

          let response = await axios.post(`${this.api_url}/bill/approve/${e.id}`, formData, config)

          this.tableLoading = false

          this.setAlert({
            status : true,
            color  : 'success',
            text  : response.data.message,
          })

          this.getAllBills()

        } catch (error) {
          this.setAlert({
            status : true,
            color  : 'error',
            text  : error.response.data,
          })
        }

      } 
    }

  }
}
</script>

<style>

</style>