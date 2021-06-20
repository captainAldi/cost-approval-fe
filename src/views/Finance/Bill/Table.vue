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
                      v-if="row.item.status == 'Approved'"
                      @click="uploadBP(row.item)"
                    >
                      <v-icon dark>mdi-cloud-upload-outline</v-icon>
                    </v-btn>

                    <v-btn
                      large
                      icon
                      color="green" 
                      v-if="row.item.status == 'Paid'"
                      @click="detailBP(row.item.file_bukti_pembayaran)"
                    >
                      <v-icon dark>mdi-cloud-search-outline</v-icon>
                    </v-btn>
                </td>
              </tr>
          </template>
        </v-data-table>

        <!-- Add Form -->
        <v-dialog
          v-model="dialogForm"
          max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-file-input
                      chips
                      label="File Bukti Pembayaran"
                      @change="logFileBP"
                      filled
                      class="mb-2"
                      :rules="buktiPembayaranRules"
                      show-size
                      accept=".xls,.xlsx,.pdf,.doc,.doxz"
                    >
                    </v-file-input>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-menu
                      v-model="menuTanggalTransaksi"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="tanggal_transaksi"
                          label="Tanggal Transaksi"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="tanggal_transaksi"
                        @input="menuTanggalTransaksi = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeFormDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveFormDialog"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
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
        { text: 'Judul', value: 'judul', width: '100%' },
        { text: 'Deskripsi', value: 'deskripsi' },
        { text: 'Status', value: 'status' },
        { text: 'BU', value: 'bu'},
        { text: 'BI', value: 'business_initiative' },
        { text: 'PT', value: 'nama_pt' },
        { text: 'Tempo', value: 'tanggal_jatuh_tempo' },
        { text: 'Tagihan', value: 'tagihan' },
        { text: 'Berulang', value: 'transaksi_berulang' },
        { text: 'Nama Pengaju', value: 'pengajus' },
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
      ],

      dialogForm: false,
      editedIndex: -1,
      editedItem: {
        
      },
      defaultItem: {
        
      },

      menuTanggalTransaksi: false,
      tanggal_transaksi: new Date().toISOString().substr(0, 10),

      fileDataBP: null,

    }
  },

  watch: {
    dialogForm (val) {
      val || this.closeFormDialog()
    },
  },

  mounted() {
    this.getAllBills()
  },
  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    buktiPembayaranRules() {
      let rules

      if(this.fileDataBP != null) {
        rules =  [
          v => !!v || 'File is required',
          v => !v || v.size < (3072 * 1024) || 'File Terlalu Besar > 3 MB !',
        ]
      } else {
        rules = []
      }

      return rules
    },
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

    async detailBP(e) {
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

        let response = await axios.get(`${this.api_url}/files/bukti-pembayaran/${fileName}/${fileExtension}`, config)

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

    uploadBP (e) {
      this.editedIndex = e.id
      this.dialogForm = true
    },

    logFileBP(e) {
      this.fileDataBP = e
    },

    closeFormDialog () {
      this.dialogForm = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    async saveFormDialog(e) {
      e.preventDefault()

      try {
        
        this.setDialog({
          status : true,
        })
        
        let config = {
          headers: {
            'Authorization': this.user.data.token,
            'Content-Type': 'multipart/form-data',
          }, 
        }

        let formData = new FormData()

        formData.append('file_bukti_pembayaran', this.fileDataBP)
        formData.append('fileName', this.fileDataBP.name)
        formData.append('tanggal_transaksi', this.tanggal_transaksi)
        formData.append('_method', 'PATCH')

        let response = await axios.post(`${this.api_url}/bill/pay/${this.editedIndex}`, formData, config)

        this.setDialog({
          status : false,
        })

        this.setAlert({
          status : true,
          color  : 'success',
          text  : response.data.message,
        })

        this.getAllBills()

        this.closeFormDialog()

      } catch (error) {
        this.setDialog({
          status : false,
        })

        console.log(error)
        console.log(error.response)
      }
    
    }



  }
}
</script>

<style scoped>
.v-data-table-header th {
  white-space: nowrap;
}
</style>