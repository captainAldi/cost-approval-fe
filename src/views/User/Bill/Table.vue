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
                
                hide-details
              ></v-text-field>
            </v-col>

            <v-col
              cols="2"
            >
              <!-- Add Form -->
              <v-dialog
                v-model="dialogForm"
                max-width="800px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mt-4"
                    v-bind="attrs"
                    v-on="on"
                    small
                  >
                    <v-icon>
                      mdi-plus-circle
                    </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="formAddBill"
                        v-model="validAddBillForm"
                        lazy-validation
                      >
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.judul"
                              label="Judul Tagihan"
                              :rules="[v => !!v || 'Masukkan Judul !']"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-combobox
                              v-model="editedItem.bu"
                              label="Business Unit"
                              :rules="[v => !!v || 'Masukkan Business unit !']"
                              small-chips
                              hide-selected
                              :items="['HO', 
                                        'AB', 
                                        'BSA',
                                        'ALTA',
                                        'AX'
                                      ]"
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      Press <kbd>enter</kbd> to add
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                          <v-combobox
                              v-model="editedItem.business_initiative"
                              label="Business Initiative"
                              :rules="[v => !!v || 'Masukkan Business Initiative !']"
                              small-chips
                              hide-selected
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      Press <kbd>enter</kbd> to add
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-combobox
                              v-model="editedItem.approver_email"
                              label="E-Mail Approver"
                              :rules="[
                                v => !v || v.length >= 1 || 'Masukkan Approver'
                              ]"
                              multiple
                              small-chips
                              hide-selected
                              :items="approversName"
                              :search-input.sync="searchApproverName"
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      Press <kbd>enter</kbd> to add
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-combobox
                              v-model="editedItem.nama_pt"
                              label="Nama PT"
                              :rules="[v => !!v || 'Masukkan Nama PT !']"
                              small-chips
                              :items="['ATI', 
                                        'STI', 
                                        'AKJ', 
                                        'GST', 
                                        'TNJ', 
                                        'BTI', 
                                        'BSA', 
                                        'ANJ', 
                                        'AIT', 
                                        'MKP', 
                                        'AON', 
                                        'HNJ',
                                        'TNJ'
                                      ]"
                              hide-selected
                              
                            ></v-combobox>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select
                              v-model="editedItem.transaksi_berulang"
                              :items="['Ya', 'Tidak']"
                              :rules="[v => !!v || 'Pilih Salah Satu !']"
                              label="Transaksi Berulang ?"
                              
                              required
                            ></v-select>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.jumlah_tagihan"
                              type="number"
                              label="Jumlah Tagihan"
                              :rules="[
                                v => !!v || 'Masukkan Jumlah Tagihan !',
                                v => /^[0-9]+$/.test(v) || 'Masukkan Angka !',
                              ]"
                              prefix="Rp"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-menu
                              v-model="menuTanggalJatuhTempo"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.tanggal_jatuh_tempo"
                                  label="Tanggal Jatuh Tempo"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.tanggal_jatuh_tempo"
                                @input="menuTanggalJatuhTempo = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col
                            cols="12"
                          >
                            <v-file-input
                              chips
                              label="File Invoice"
                              @change="logFileInv"
                              filled
                              class="mb-2"
                              :rules="importRules"
                              show-size
                              accept=".xls,.xlsx,.pdf,.doc,.doxz"
                            >
                            </v-file-input>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col
                            cols="12"
                          >
                            <v-textarea
                              filled
                              v-model="editedItem.deskripsi"
                              label="Deskripsi Tagihan"
                              :rules="[v => !!v || 'Masukkan Deskripsi !']"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-form>
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
                      :disabled="!validAddBillForm"
                      color="blue darken-1"
                      text
                      @click="saveFormDialog"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
                <td v-else>Belum di Bayar</td>

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
        { text: 'BI', value: 'business_initiative' },
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
      ],

      dialogForm: false,
      editedIndex: -1,
      editedItem: {
        judul: "",
        deskripsi: "",
        bu: "",
        approver_email: [],
        business_initiative: '',
        nama_pt: '',
        transaksi_berulang: '',
        jumlah_tagihan: 0,
        tanggal_jatuh_tempo: new Date().toISOString().substr(0, 10),
      },
      defaultItem: {
        judul: "",
        deskripsi: "",
        bu: "",
        approver_email: [],
        business_initiative: '',
        nama_pt: '',
        transaksi_berulang: '',
        jumlah_tagihan: 0,
        tanggal_jatuh_tempo: new Date().toISOString().substr(0, 10),
      },

      menuTanggalJatuhTempo: false,

      fileDataInv: null,
      validAddBillForm: false,

      approversName: [],
      searchApproverName: ''
    }
  },

  watch: {
    dialogForm (val) {
      val || this.closeFormDialog()
    },
  },

  mounted() {
    this.getAllBills()
    this.getApproversName()
  },
  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    importRules() {
      let rules

      if(this.fileDataInv != null) {
        rules =  [
          v => !!v || 'File is required',
          v => !v || v.size < (3072 * 1024) || 'File Terlalu Besar > 3 MB !',
        ]
      } else {
        rules = [v => !!v || 'File is required',]
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

    async getApproversName() {
      try {

        let config = {
          headers: {
            'Authorization': this.user.data.token
          }
        }

        let response = await axios.get(this.api_url + '/approvers/name/get', config)

        let mappedEmail = response.data.data.map(item => {
          return item['email']
        })

        this.approversName = mappedEmail

      } catch (error) {
        console.log(error.response.message)
      }
      
    },
    
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

    logFileInv(e) {
      this.fileDataInv = e
    },

    closeFormDialog () {
      this.dialogForm = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$refs.formAddBill.resetValidation()
    },

    async saveFormDialog(e) {
      e.preventDefault()

      if (!this.$refs.formAddBill.validate()) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : 'Isi Data dengan Lengkap !',
        })
      } else {
        
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

          formData.append('file_inv', this.fileDataInv)
          formData.append('fileName', this.fileDataInv.name)

          formData.append('judul', this.editedItem.judul)
          formData.append('deskripsi', this.editedItem.deskripsi)
          formData.append('bu', this.editedItem.bu)
          formData.append('business_initiative', this.editedItem.business_initiative)
          formData.append('nama_pt', this.editedItem.nama_pt)
          formData.append('transaksi_berulang', this.editedItem.transaksi_berulang)
          formData.append('jumlah_tagihan', this.editedItem.jumlah_tagihan)
          formData.append('tanggal_jatuh_tempo', this.editedItem.tanggal_jatuh_tempo)

          this.editedItem.approver_email.forEach(element => {
            formData.append('approver_email[]', element)
          })

          const response = await axios.post(this.api_url + '/bill/add', formData, config)

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

          this.closeFormDialog()

          this.alertObject.status = true
          this.alertObject.type = 'error'
          this.alertObject.message = error.response.data

        }

      }
    }


  }
}
</script>

<style>

</style>