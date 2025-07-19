<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Diretorates
        </span>
        <p class="text-gray-400">A list of directorates within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newDirectorateDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add directorate
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="directorates"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <directorate-list-item
        v-for="directorate in directorates"
        :key="directorate.id"
        :directorate="directorate"
      />
    </div>

    <div v-if="directorates.length" class="mt-6">
      <base-pagination resource="Directorates" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No directorates found!
    </div>

    <base-modal :open="newDirectorateDialog" width="500px" @close="newDirectorateDialog = false">
      <directorate-form @done="newDirectorateDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DirectorateListItem from '~/components/organistional-structure/DirectorateListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import DirectorateForm from '~/components/settings/DirectorateForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'DirectoratesPage',

  components: { BaseModal, BaseFilters, DirectorateForm, TabMenu, BasePagination, DirectorateListItem },

  data() {
    return {
      newDirectorateDialog: false,
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
    await store.dispatch('organisational-structure/fetchDirectorates')
  },

  computed: {
    ...mapState({ directorates: (state) => state['organisational-structure'].directorates })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchDirectorates')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>