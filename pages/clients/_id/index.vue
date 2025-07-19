<template>
  <div>
    <base-breadcrumb :items="items" />

    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Clients -
          <span>{{ client.name }}</span>
        </span>
        <p class="text-gray-400">Details of {{ client.name }}</p>
      </div>
    </div>

    <tab-menu :items="tabItems" />

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
        for-workload-audit
      />
    </div>

    <div v-if="activities.length" class="mt-6">
      <base-pagination resource="Activities" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No activities found! Please try searching or filtering
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActivityListItem from '~/components/activities/ActivityListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseBreadcrumb from '~/components/ui/BaseBreadcrumb.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'SingleClient',

  components: { BaseBreadcrumb, TabMenu, BaseFilters, ActivityListItem, BasePagination },

  async asyncData({ $axios, params }) {
    const [client, directorates] = await Promise.all([
      $axios.$get(`/clients/${params.id}`),
      $axios.$get('directorates', {
        params: {
          client_id: params.id
        }
      })
    ])

    return {
      client: client.data,
      directorates: directorates.data
    }
  },

  data() {
    return {
      items: [
        { label: 'Home', name: 'home', to: '/' },
        { label: 'Clients', name: 'clients', to: '/clients' },
        { label: `Details`, name: 'single-client', to: '/clients' },
      ],
      tabItems: [
        { name: 'Activities', to: `/clients/${this.$route.params.id}`, exact: true }
      ],
      loading: false,
      filters: {
        directorate: null
      },
      directorate: null,
      department: null,
      unit: null,
      departments: [],
      units: []
    }
  },

  async fetch({ store }) {
    await store.dispatch('activities/resetActivities')
  },

  computed: {
    // directorate: {
    //   get() {
    //     return this.$store.state.reusables.directorate
    //   },
    //   set(value) {
    //     this.$store.commit('reusables/updateDirectorate', value)
    //   }
    // },

    // department: {
    //   get() {
    //     return this.$store.state.reusables.department
    //   },
    //   set(value) {
    //     this.$store.commit('reusables/updateDepartment', value)
    //   }
    // },

    // unit: {
    //   get() {
    //     return this.$store.state.reusables.unit
    //   },
    //   set(value) {
    //     this.$store.commit('reusables/updateUnit', value) 
    //   }
    // },
    ...mapState({ activities: (state) => state.activities.all })
  },

  watch: {
    directorate: {
      handler() {
        if(this.directorate) {
          this.filters = {
            directorate: this.directorate
          }
          this.getDepartments({client_id: this.$route.params.id, directorate: this.directorate})
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
        this.getUnits({client_id: this.$route.params.id, department: this.department})
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
      await this.$store.dispatch('activities/fetchAll', { client_id: this.$route.params.id })
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

<style>

</style>