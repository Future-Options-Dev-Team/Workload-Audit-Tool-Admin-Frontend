<template>
  <div class="mt-2">
    <div class="flex">
      <div class="ml-auto flex">
        <v-btn
          :loading="submitting"
          depressed
          color="primary"
          class="ml-auto"
          @click="runReport"
        >
          Run report
      </v-btn>
      </div>
    </div>
    
    <div class="flex mt-5">
      <div v-if="availableFilters" class="grid grid-cols-5 gap-4">
        <v-autocomplete
          v-if="show('directorate_id')"
          v-model="form.directorate_id"
          :items="directorates"
          :loading="searching"
          outlined
          clearable
          dense
          item-text="name"
          item-value="id"
          label="Select directorate"
          placeholder="Select directorate"
        />
        <v-autocomplete
          v-if="show('unit_id')"
          v-model="form.unit_id"
          :items="units"
          :loading="searching"
          outlined
          clearable
          dense
          item-text="name"
          item-value="id"
          label="Select unit"
          placeholder="Select unit"
        />
        <v-autocomplete
          v-if="show('activity_id')"
          v-model="form.activity_id"
          :items="activities"
          :search-input.sync="search_activities"
          :loading="searching"
          outlined
          clearable
          dense
          item-text="name"
          item-value="id"
          label="Select activity"
          placeholder="Select activity"
        />
        <v-autocomplete
          v-if="show('activities')"
          v-model="form.activities"
          :items="activities"
          :search-input.sync="search_activities"
          :loading="searching"
          outlined
          clearable
          dense
          multiple
          item-text="name"
          item-value="id"
          label="Select multiple activities"
          placeholder="Select multiple activities"
        />
        <v-autocomplete
          v-if="show('position_id')"
          v-model="form.position_id"
          :items="positions"
          :loading="searching"
          :item-text="getItemText"
          outlined
          clearable
          dense
          item-value="id"
          label="Select position"
          placeholder="Select position"
        >
          <template #selection="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
          <template #item="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
        </v-autocomplete>

        <v-autocomplete
          v-if="show('positions')"
          v-model="form.positions"
          :items="positions"
          :loading="searching"
          :item-text="getItemText"
          multiple
          outlined
          clearable
          dense
          item-value="id"
          label="Select positions"
          placeholder="Select positions"
        >
          <template #selection="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
          <template #item="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
        </v-autocomplete>
        <v-switch
          v-if="show('split_workload')"
          v-model="form.split_workload"
          label="Split workload driver"
          color="primary"
          hide-details
        ></v-switch>
      </div>
      <div class="relative ml-auto">
        <!-- <button class="rounded py-2 px-4 bg-white shadow focus:bg-gray-100 focus:shadow-lg" @click="filterWindowOpen = !filterWindowOpen">
          <span class="fe fe-plus" /> Add filter
        </button> -->

        <div v-show="filterWindowOpen" class="fixed inset-0 h-full w-full z-20" @click="filterWindowOpen = false"></div>

        <div
          v-show="filterWindowOpen"
          class="absolute right-0 p-3 mt-1 overflow-hidden bg-white rounded shadow-lg z-20 min-h-72"
        >
          
        </div>
      </div>
    </div>

    <div class="mt-2">
      <div v-if="run" class="py-4 rounded-t flex items-center px-2 border-gray-300">
        <v-btn
          :loading="downloadingPdf"
          depressed
          dark
          outlined
          small
          color="red darken-2"
          class="bg-red-100"
          @click="downloadReport('pdf')"
        >
          <v-icon small left>mdi-file-pdf-box</v-icon> Download PDF
        </v-btn>
        <v-btn
          :loading="downloadingExcel"
          depressed
          dark
          outlined
          small
          color="green darken-2"
          class="ml-5 bg-green-100"
          @click="downloadReport('excel')"
        >
          <v-icon small left>mdi-file-excel</v-icon> Download Excel
        </v-btn>
      </div>
      <div id="table" ref="table" class="rounded overflow-scroll border bg-white" style="height: calc(100vh - 150px)">
        <div class="mx-auto text-gray-600 text-center pt-4">
          <div class="flex justify-center h-full">
            <!-- <v-btn :loading="submitting" depressed color="primary" @click="runReport">
              Run report
            </v-btn> -->
            <div class="text-gray-300 text-2xl font-semibold mt-20">
              Click run report button to view report
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import include from 'lodash/includes'
import pickBy from 'lodash/pickBy'
export default {
  name: 'LoadReport',

  components: {},

  props: {
    report: {
      type: Object,
      required: true
    },
    filters: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      filterWindowOpen: false,
      run: false,
      availableFilters: null,
      showFilters: false,
      submitting: false,
      downloadingPdf: false,
      downloadingExcel: false,
      search_activities: '',
      searching: false,
      date_range: {
        start_date: '',
        end_date: ''
      },
      form: {
        search: '',
        directorate_id: null,
        unit_id: null,
        activity_id: null,
        activities: null,
        positions: null,
        status: null,
        branch: null,
        user_id: null,
        channel: null,
        type: null,
        group_by: null,
        start_date: null,
        end_date: null,
        start_date_time: null,
        end_date_time: null,
        date: null,
        created_start_date: null,
        created_end_date: null,
        modified_start_date: null,
        modified_end_date: null,
        sort_by: null,
        order: null,
        gender: null,
        split_workload: false
      },
      settings: this.$auth.user.institution,
      directorates: [],
      units: [],
      activities: [],
      positions: []
    }
  },
  computed: {
    loading() {
      return this.downloadingPdf || this.downloadingExcel
    }
  },
  watch: {
    'form.search': {
      handler () {
        this.runReport()
      }
    },
    'form.sort_by': {
      handler () {
        this.runReport()
      }
    },
    'form.group_by': {
      handler () {
        this.runReport()
      }
    },
    'form.order': {
      handler () {
        this.runReport()
      }
    },
    date_range: {
      handler () {
        if (this.date_range.start_date || this.date_range.end_date){
          this.form.start_date = this.date_range.start_date
          this.form.end_date = this.date_range.end_date
        }
      },
      immediate: false,
      deep: true
    },
    'form.directorate_id'() {
      this.fetchUnits({directorate: this.form.directorate_id})
    },
    'form.unit_id'() {
      this.fetchActivities({unit: this.form.unit_id})
      this.getPositions({unit: this.form.unit_id})
    }
  },

  created() {
    this.getFilters()
    this.fetchDirectorates()
    this.getPositions()
  },

  methods: {
    getItemText(item) {
      return `${item.name} - ${item.code}`;
    },
    fetchDirectorates(filters = {}) {
      this.searching = true
      this.$axios.$get('directorates', { 
          params: {
            per_page: 300,
            ...filters
          }
        })
        .then((response) => {
          this.searching = false
          this.directorates = response.data
        }).catch((error) => {
          this.searching = false
          this.$toast.error(error.response.data.message)
        })
    },
    fetchUnits(filters = {}) {
      this.searching = true
      this.$axios.$get('units', { 
          params: {
            per_page: 300,
            ...filters
          }
        })
        .then((response) => {
          this.searching = false
          this.units = response.data
        }).catch((error) => {
          this.searching = false
          this.$toast.error(error.response.data.message)
        })
    },
    fetchActivities(filters = {}) {
      this.searching = true
      this.$axios.$get('activities', { 
          params: {
            per_page: 300,
            ...filters
          }
        })
        .then((response) => {
          this.searching = false
          this.activities = response.data
        }).catch((error) => {
          this.searching = false
          this.$toast.error(error.response.data.message)
        })
    },
    getPositions(filters = {}) {
      this.$axios.$get(`/positions`, {
        params: {
          per_page: 3000
        }
      }).then((response) => {
        this.positions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },
    async runReport () {
      this.submitting = true
      if (this.isRequired('customer', 'customer_id')) {
        this.submitting = false
        return this.$toast.error('Customer ID is required')
      }
      this.$refs.table.innerHTML = await this.$axios.$get(`reports/${this.report.id}/raw`, {
        params: pickBy(this.form)
      })

      this.foldGroups()

      this.showFilters = false
      this.submitting = false
      this.run = true
    },


    foldGroups () {
      const elements = document.querySelectorAll('.group-row')
      const fold = document.querySelectorAll('.fold')
      if (fold.length) {
        fold.forEach(item => item.classList.add('hidden'))
      }
      if (elements.length) {
        elements.forEach((item) => {
          item.addEventListener('click', (event) => {
            const element = `.group${event.target.parentElement.id}`
            document.querySelectorAll(element).forEach(item => item.classList.toggle('hidden'))
          })
        })
      }
    },
    toggleFilters () {
      this.showFilters = !this.showFilters
    },

    async getFilters () {
      this.availableFilters = await this.$axios.$get('/report-filters')
    },
    isSelected (filter, formKey) {
      return include(this.filters, filter) &&
          (formKey ? (this.form[formKey] !== null) : (this.form[filter] !== null))
    },
    show (filter) {
      return include(this.filters, filter)
    },
    isRequired (filter, formKey) {
      return include(this.filters, filter) && this.form[formKey] === null
    },
    async downloadReport (type) {
      type === 'pdf' ? this.downloadingPdf = true : this.downloadingExcel = true
      // const reportId = document.querySelector('.report').id
      await this.$axios.$get(`reports/${this.report.id}/${type}`,
        {
          responseType: 'arraybuffer',
          params: pickBy(this.form)
        }).then((res) => {
          this.downloadPdfExcel(res, type)
          this.downloadingPdf = false
          this.downloadingExcel = false
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
          // this.$toast.error(error)
          this.$toast.error('You don not have permission to download report!')
          this.downloadingPdf = false
          this.downloadingExcel = false
        })

      // const linkSource = `data:${(type === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel')};base64,${data}`
      // const downloadLink = document.createElement('a')

      // downloadLink.href = linkSource
      // downloadLink.download = `${(this.$moment().format('LLL'))}.${(type === 'pdf' ? 'pdf' : 'xlsx')}`
      // downloadLink.click()
      this.downloadingPdf = false
      this.downloadingExcel = false
    },

    downloadPdfExcel(data, type) {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${(this.$moment().format('LLL'))}-report.${(type === 'pdf' ? 'pdf' : 'xlsx')}`
      )
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>
<style lang="less">
  table {
    border-collapse: collapse;
    width: 100%;
    white-space: nowrap;
    @apply table-auto text-sm;
  }

  table.report thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    @apply bg-gray-600 text-gray-100;
  }

  table.report tr.sticky td {
    position: sticky;
    top: 0;
    z-index: 1;
    @apply bg-gray-600 text-gray-100 pt-10;
  }

  table.report > thead th:first-child, table.report > tr.sticky td:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
  }
  table.report > tbody > tr > td:first-of-type {
    position: sticky;
    left: 0;
    @apply bg-gray-600 text-gray-100;
    z-index: 1;
  }

  table.report > tbody > tr > td.red {
    @apply bg-red-100;
  }

  table.report > tbody tr td.green {
    @apply bg-green-100;
  }
  caption {
    padding: 0.25rem;
    position: sticky;
    left: 0;
  }

  table.report th, table.report td {
    padding: 0.5rem;
    text-align: left;
    @apply border-gray-300 text-gray-800;
  }

  table tr.group-row{
    @apply border-none bg-white !important;
  }
  table .group-row td{
    @apply border-none text-blue-500 font-bold uppercase bg-white cursor-pointer;
  }

  table caption {
    @apply font-bold text-gray-800 text-lg;
  }

  img.logo {
    @apply w-40 h-auto;
  }

  table.report tbody tr:nth-child(odd) {
    @apply bg-gray-200;
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  table.audit-totals > th, table.audit-totals > td {
    text-align: left !important;
    border: 1px solid;
  }
</style>
