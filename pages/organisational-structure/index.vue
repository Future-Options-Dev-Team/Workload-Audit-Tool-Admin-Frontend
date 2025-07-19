<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Divisions
        </span>
        <p class="text-gray-400">A list of division within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newDivisionDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add division
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="divisions"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <division-list-item v-for="division in divisions" :key="division.id" :division="division" />
    </div>

    <div class="mt-6">
      <base-pagination resource="Divisions" @changePage="pageChangeHandler" />
    </div>

    <base-modal :open="newDivisionDialog" width="500px" @close="newDivisionDialog = false">
      <division-form @done="newDivisionDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DivisionListItem from '~/components/organistional-structure/DivisionListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import DivisionForm from '~/components/settings/DivisionForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'OrganisationalStructure',

  components: { TabMenu, BaseModal, DivisionForm, BaseFilters, BasePagination, DivisionListItem },

  data() {
    return {
      items: [
        { name: 'Divisions', to: '/organisational-structure', exact: true },
        { name: 'Directorates', to: '/organisational-structure/directorates', exact: true },
        { name: 'Departments', to: '/organisational-structure/departments', exact: true },
        { name: 'Units', to: '/organisational-structure/units', exact: true },
        { name: 'Sections', to: '/organisational-structure/sections', exact: true },
        { name: 'Positions', to: '/organisational-structure/positions', exact: true }
      ],
      newDivisionDialog: false,
      loading: false,
      filters: {}
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('organisational-structure/fetchDivisions')
  },

  computed: {
    ...mapState({ divisions: (state) => state['organisational-structure'].divisions })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchDivisions')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>