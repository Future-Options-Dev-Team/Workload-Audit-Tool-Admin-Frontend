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
          color="grey lighten-2"
          @click="newDivisionDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add division
        </v-btn>
      </div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="divisions"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      {{ divisions }}
    </div>

    <div v-if="divisions.length" class="mt-6">
      <base-pagination resource="Activities" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No divisions found!
    </div>

    <base-modal :open="newDivisionDialog" width="500px" @close="newDivisionDialog = false">
      <division-form />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasePagination from '~/components/pagination/BasePagination.vue'
import DivisionForm from '~/components/settings/DivisionForm.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
export default {
  name: 'DivisionsPage',

  components: { BaseModal, BaseFilters, DivisionForm, BasePagination },

  data() {
    return {
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