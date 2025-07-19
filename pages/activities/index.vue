<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Activities
        </span>
        <p class="text-gray-400">A list of activities and their statuses</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newActivityDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add activity
        </v-btn>
      </div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      :always-open="true"
      search-placeholder="activities"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    >
      <div>
        <div class="text-gray-400 text-sm font-medium mb-2">Filters</div>
        <div class="grid grid-cols-3 gap-4">
          <v-autocomplete
            v-model="directorate"
            :items="directorates"
            dense
            outlined
            light
            clearable
            label="Directorate"
            item-text="name"
            item-value="id"
          ></v-autocomplete>

          <v-autocomplete
            v-model="department"
            :items="departments"
            dense
            outlined
            light
            clearable
            label="Department"
            item-text="name"
            item-value="id"
          ></v-autocomplete>

          <v-autocomplete
            v-model="unit"
            :items="units"
            dense
            outlined
            light
            clearable
            label="Unit"
            item-text="name"
            item-value="id"
          ></v-autocomplete>
        </div>
      </div>
    </base-filters>

    <div class="mt-5">
      <activity-list-item
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
      />
    </div>

    <div v-if="activities.length" class="mt-6">
      <base-pagination resource="Activities" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No activities found! Please try searching or filtering
    </div>

    <base-modal :open="newActivityDialog" width="500px" @close="newActivityDialog = false">
      <activity-form @done="newActivityDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActivityForm from '~/components/activities/ActivityForm.vue'
import ActivityListItem from '~/components/activities/ActivityListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
export default {
  name: 'ActivitiesPage',
  
  components: { BaseModal, BaseFilters, ActivityForm, BasePagination, ActivityListItem },

  async asyncData({ $axios }) {
    const [directorates] = await Promise.all([
      $axios.$get('directorates')
    ])

    return {
      directorates: directorates.data
    }
  },

  data() {
    return {
      newActivityDialog: false,
      loading: false,
      filters: {
        directorate: null
      },
      departments: [],
      units: []
    }
  },

  // async fetch({ store }) {
  //   await store.dispatch('filters/reset')
  //   await store.dispatch('activities/fetchAll')
  // },

  computed: {
    directorate: {
      get() {
        return this.$store.state.reusables.directorate
      },
      set(value) {
        this.$store.commit('reusables/updateDirectorate', value)
      }
    },

    department: {
      get() {
        return this.$store.state.reusables.department
      },
      set(value) {
        this.$store.commit('reusables/updateDepartment', value)
      }
    },

    unit: {
      get() {
        return this.$store.state.reusables.unit
      },
      set(value) {
        this.$store.commit('reusables/updateUnit', value) 
      }
    },
    ...mapState({ activities: (state) => state.activities.all })
  },

  watch: {
    directorate: {
      handler() {
        if(this.directorate) {
          this.filters = {
            directorate: this.directorate
          }
          this.getDepartments({directorate: this.directorate})
        }
      },
      immediate: true
    },
    department: {
      handler() {
        this.filters = {
          directorate: this.directorate,
          department: this.department
        }
        this.getUnits({department: this.department})
      },
      immediate: true
    },
    unit: {
      handler() {
        this.filters = {
          directorate: this.directorate,
          department: this.department,
          unit: this.unit
        }
        this.pageChangeHandler()
      },
      immediate: false
    }
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('activities/fetchAll')
      this.loading = false
    },

    getDepartments(filters = {}) {
      this.loadingDepartments = true
      this.$axios.$get(`/departments`, {
        params: {
          ...filters
        }
      }).then((response) => {
        this.departments = response.data
        this.loadingDepartments = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loadingDepartments = false
      })
    },

    getUnits(filters = {}) {
      this.loadingUnits = true
      this.$axios.$get(`/units`, {
        params: {
          ...filters
        }
      }).then((response) => {
        this.units = response.data
        this.loadingUnits = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loadingUnits = false
      })
    },
  }
}
</script>
