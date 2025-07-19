<template>
  <div>
    <div class="mt-5 flex">
      <div class="ml-5">
        <span class="text-2xl text-gray-700 font-medium block">
          Workload Audit
        </span>
        <p class="text-gray-400">Workload audit computations</p>
      </div>
    </div>

    <tab-menu :items="items" />

    <div class="sticky top-0">
      <v-text-field
        v-model="search"
        :loading="loading"
        solo
        clearable
        prepend-inner-icon="mdi-magnify"
        label="Search data"
        class="mt-16"
      ></v-text-field>
    </div>

    <div class="mt-5">
      <!-- <div class="flex">
        <div class="w-2/3"></div>
        <div class="ml">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="position in positions" :key="position.id" class="font-semibold text-lg text-gray-500">
              {{ position.code }}
            </div>
          </div>
        </div>
      </div> -->
      <div v-if="surveyData.length && !loading">
        <div v-for="directorate in surveyData" :key="directorate.id" class="mb-4">
          <span class="text-lg font-semibold text-gray-500">{{ directorate.name }}</span>

          <div v-for="department in directorate.departments" :key="department.id" class="ml-4 py-2">
            <span class="text-gray-500 font-medium">{{ department.name }}</span>

            <div v-for="unit in department.units" :key="unit.id" class="ml-4 py-2">
              <div class="flex items-center">
                <v-icon>mdi-menu-down</v-icon>
                <span class="text-gray-500">{{ unit.name }}</span>
                <div v-if="unit.is_regional" class="ml-auto">
                  <v-progress-circular
                    v-if="duplicating"
                    size="30"
                    :width="1"
                    color="indigo"
                    indeterminate
                  ></v-progress-circular>
                  <v-tooltip v-else bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        depressed
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="duplicate(unit.id)"
                      >
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Duplicate unit</span>
                  </v-tooltip>

                  <span v-if="unit.is_duplicate">
                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          depressed
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="editUnit(unit)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit unit</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          depressed
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="deleteUnit(unit.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete unit</span>
                    </v-tooltip>
                  </span>
                </div>
              </div>

              <div v-for="activity in unit.activities" :key="activity.id" class="ml-4 py-2 flex">
                <div>
                  <nuxt-link :to="`/workload-audit/activity/${activity.id}`" class="flex items-center">
                    <v-icon>mdi-menu-right</v-icon>
                    <span class="text-blue-500">{{ `${activity.activity_number}: ${activity.name}` }}</span>
                  </nuxt-link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="text-2xl text-gray-400 font-bold">
        Searching...
      </div>

      <div v-else class="text-2xl text-gray-400 font-bold">
        No data found!
      </div>
    </div>

    <base-modal :open="dialog" width="500px" @close="dialog = false">
      <unit-form :unit="singleUnit" @done="done" />
    </base-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TabMenu from '~/components/ui/TabMenu.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import UnitForm from '~/components/settings/UnitForm.vue'
export default {
  name: 'WorkloadAuditPage',

  components: { TabMenu, BaseModal, UnitForm },

  data() {
    return {
      dialog: false,
      loading: false,
      duplicating: false,
      filters: {},
      items: [
        { name: 'Workload', to: '/workload-audit', exact: true }
      ],
      surveyData: [],
      positions: [],
      singleUnit: null
    }
  },

  computed: {
    search: {
      get() {
        return this.$store.state.reusables.search
      },
      set(value) {
        this.$store.commit('reusables/updateSearch', value) 
      }
    }
  },

  watch: {
    search: debounce(function() {
      this.getSurveyData()
    }, 1500)
  },

  mounted() {
    this.getSurveyData()
  },

  methods: {
    run() {
      this.getSurveyData()
    },

    debouncedSearch: debounce(() => {
      this.getSurveyData()
    }, 1500),

    getSurveyData() {
      this.loading = true
      this.$axios.$get(`/survey-data`, {
        params: {
          search: this.search
        }
      }).then((response) => {
        this.surveyData = response.data
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    },
    getPositions() {
      this.loading = true
      this.$axios.$get(`/positions`).then((response) => {
        this.positions = response.data
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    },
    getParticipants() {},
    pageChangeHandler() {},

    duplicate(id) {
      this.$swal.fire({
        title: 'Please confirm duplicate!',
        text: 'Are you sure want to duplicate unit?',
        showCancelButton: true,
        confirmButtonText: 'Yes, duplicate!',
        preConfirm: () => {
          this.duplicating = true
          return this.$axios.$get(`/units/${id}/duplicate`).then((response) => {
            this.$nuxt.refresh()
            this.duplicating = false
            this.getSurveyData()
            this.$toast.success('Unit duplicated!')
          }).catch((error) => {
            this.$toast.error(error.response.data.message)
            this.duplicating = false
          })
        }
      })
    },
    editUnit(unit) {
      this.dialog = true
      this.singleUnit = unit
    },
    done() {
      this.dialog = false
      this.getSurveyData()
    },
    deleteUnit(id) {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete unit?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/units/${id}`)
            .then(() => {
              this.$toast.success('Unit deleted successfully!')
              this.$nuxt.refresh()
              this.getSurveyData()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    }
  }
}
</script>
