<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Departments
        </span>
        <p class="text-gray-400">A list of departments within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed
          dark
          color="primary"
          @click="newDepartmentDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add department
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="departments"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <department-list-item
        v-for="department in departments"
        :key="department.id"
        :department="department"
      />
    </div>

    <div v-if="departments.length" class="mt-6">
      <base-pagination resource="Departments" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No departments found!
    </div>

    <base-modal :open="newDepartmentDialog" width="500px" @close="newDepartmentDialog = false">
      <department-form @done="newDepartmentDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DepartmentListItem from '~/components/organistional-structure/DepartmentListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import DepartmentForm from '~/components/settings/DepartmentForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'DirectoratesPage',

  components: { BaseModal, BaseFilters, DepartmentForm, TabMenu, BasePagination, DepartmentListItem },

  data() {
    return {
      newDepartmentDialog: false,
      loading: false,
      filters: {},
      items: [
        { name: 'Divisions', to: '/organisational-structure', exact: true },
        { name: 'Directorates', to: '/organisational-structure/directorates', exact: true },
        { name: 'Departments', to: '/organisational-structure/departments', exact: true },
        { name: 'Units', to: '/organisational-structure/units', exact: true },
        { name: 'Sections', to: '/organisational-structure/sections', exact: true },
        { name: 'Positions', to: '/organisational-structure/positions', exact: true }
      ]
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('organisational-structure/fetchDepartments')
  },

  computed: {
    ...mapState({ departments: (state) => state['organisational-structure'].departments })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchDepartments')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>