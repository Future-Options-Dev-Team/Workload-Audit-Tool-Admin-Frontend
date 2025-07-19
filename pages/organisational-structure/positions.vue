<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Positions
        </span>
        <p class="text-gray-400">A list of positions within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newPositionDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add position
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="positions"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <position-list-item
        v-for="position in positions"
        :key="position.id"
        :position="position"
      />
    </div>

    <div v-if="positions.length" class="mt-6">
      <base-pagination resource="Positions" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No positions found!
    </div>

    <base-modal :open="newPositionDialog" width="500px" @close="newPositionDialog = false">
      <position-form @done="newPositionDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PositionForm from '~/components/organistional-structure/PositionForm.vue'
import PositionListItem from '~/components/organistional-structure/PositionListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'UnitsPage',

  components: {
    BaseModal,
    BaseFilters,
    TabMenu,
    BasePagination,
    PositionForm,
    PositionListItem 
  },

  data() {
    return {
      newPositionDialog: false,
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
    await store.dispatch('organisational-structure/fetchPositions')
  },

  computed: {
    ...mapState({ positions: (state) => state['organisational-structure'].positions })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchPositions')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>