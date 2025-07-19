<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Workload
        </span>
        <p class="text-gray-400">Workload</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="success"
          @click="dialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Download excel
        </v-btn>

        <v-btn 
          depressed 
          color="primary"
          @click="dialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add new record
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <div class="mt-5">
      <predetermined-workload-list-item
        v-for="workload in workloads"
        :key="workload.id"
        :workload="workload"
      />
    </div>

    <div v-if="workloads.length" class="mt-6">
      <base-pagination resource="Workloads" @changePage="pageChangeHandler" />
    </div>

    <base-modal :open="dialog" width="500px" @close="dialog = false">
      <predetermined-workload-form />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
import PredeterminedWorkloadForm from '~/components/workload/PredeterminedWorkloadForm.vue'
import PredeterminedWorkloadListItem from '~/components/workload/PredeterminedWorkloadListItem.vue'
export default {
  name: 'WorkloadDriversPage',

  components: {
    TabMenu,
    BaseModal,
    PredeterminedWorkloadForm,
    PredeterminedWorkloadListItem,
    BasePagination
  },

  data() {
    return {
      dialog: false,
      items: [
        { name: 'Workload', to: '/workload-audit', exact: true },
        { name: 'Preview survey file', to: '/workload-audit/survey-file', exact: true },
      ]
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('workload/fetchWorkloads')
  },

  computed: {
    ...mapState({ workloads: (state) => state.workload.workloads })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('workload/fetchWorkloads')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>