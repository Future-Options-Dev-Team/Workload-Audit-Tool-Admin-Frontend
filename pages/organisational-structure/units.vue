<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Units
        </span>
        <p class="text-gray-400">A list of units within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newUnitDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add unit
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="units"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <unit-list-item v-for="unit in units" :key="unit.id" :unit="unit" />
    </div>

    <div v-if="units.length" class="mt-6">
      <base-pagination resource="Units" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No units found!
    </div>

    <base-modal :open="newUnitDialog" width="500px" @close="newUnitDialog = false">
      <unit-form @done="newUnitDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UnitListItem from '~/components/organistional-structure/UnitListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import UnitForm from '~/components/settings/UnitForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'UnitsPage',

  components: { BaseModal, BaseFilters, UnitForm, TabMenu, BasePagination, UnitListItem },

  data() {
    return {
      newUnitDialog: false,
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
    await store.dispatch('organisational-structure/fetchUnits')
  },

  computed: {
    ...mapState({ units: (state) => state['organisational-structure'].units })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchUnits')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>