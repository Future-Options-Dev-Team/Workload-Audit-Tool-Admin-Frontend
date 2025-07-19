<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Sections
        </span>
        <p class="text-gray-400">A list of sections within the organisation</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newSectionDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add section
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="sections"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <section-list-item
        v-for="section in sections"
        :key="section.id"
        :section="section"
      />
    </div>

    <div v-if="sections.length" class="mt-6">
      <base-pagination resource="Sections" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No sections found!
    </div>

    <base-modal :open="newSectionDialog" width="500px" @close="newSectionDialog = false">
      <section-form @done="newSectionDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SectionListItem from '~/components/organistional-structure/SectionListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import SectionForm from '~/components/settings/SectionForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'SectionsPage',

  components: { BaseModal, BaseFilters, SectionForm, TabMenu, BasePagination, SectionListItem },

  data() {
    return {
      newSectionDialog: false,
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
    await store.dispatch('organisational-structure/fetchSections')
  },

  computed: {
    ...mapState({ sections: (state) => state['organisational-structure'].sections })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('organisational-structure/fetchSections')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>