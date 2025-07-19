<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Report
        </span>
        <p class="text-gray-400">A list of all reports generated including the workload audit report</p>
      </div>
      <div class="ml-auto"></div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="reports"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5 grid grid-cols-3 gap-4">
      <report-grid-card
        v-for="report in reports"
        :key="report.id"
        :url="`/reports/${report.id}`"
        :title="report.title"
        :description="report.description"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ReportGridCard from '~/components/reports/ReportGridCard.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
export default {
  name: 'ReportsPage',

  components: { BaseFilters, ReportGridCard },

  data() {
    return {
      loading: false,
      filters: {}
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('reports/fetchAll')
  },

  computed: {
    ...mapState({ reports: (state) => state.reports.all })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('reports/fetchAll')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>
