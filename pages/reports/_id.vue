<template>
  <div>
    <div class="flex items-center">
      <v-btn icon outlined small color="primary" @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="text-lg text-gray-500 font-semibold ml-4">{{ report.title }}</span>
    </div>

    <div>
      <load-report :filters="report.filters" :report="report" />
    </div>
  </div>
</template>

<script>
import LoadReport from '~/components/reports/LoadReport.vue'
export default {
  name: 'SingleReport',

  components: {
    LoadReport
  },

  async asyncData({ $axios, params }) {
    const report = await $axios.$get(`/reports/${params.id}`)

    return {
      report: report.data
    }
  }
}
</script>
