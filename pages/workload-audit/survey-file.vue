<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Workload Audit
        </span>
        <p class="text-gray-400">Workload audit computations</p>
      </div>
    </div>

    <tab-menu :items="items" />

    <div class="mt-10 flex">
      <div class="ml-auto">
        <v-btn
          :loading="loading" 
          depressed 
          outlined
          color="primary"
          @click="run"
        >
          Get survey data
        </v-btn>
      </div>
    </div>

    <div class="mt-5">
      <div class="flex">
        <div class="w-2/3"></div>
        <div class="ml">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="position in positions" :key="position.id" class="font-semibold text-lg text-gray-500">
              {{ position.code }}
            </div>
          </div>
        </div>
      </div>
      <div v-for="activity in surveyData" :key="activity.id" class="mb-4">
        <span class="text-lg font-semibold text-gray-500">{{ activity.name }}</span>

        <div v-for="task in activity.tasks" :key="task.id" class="ml-4 py-2">
          <span class="text-gray-500">{{ task.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from '~/components/ui/TabMenu.vue'
export default {
  name: 'WorkloadAuditPage',

  components: { TabMenu },

  data() {
    return {
      newRoleDialog: false,
      loading: false,
      filters: {},
      items: [
        { name: 'Workload', to: '/workload-audit', exact: true },
        { name: 'Preview survey file', to: '/workload-audit/survey-file', exact: true },
      ],
      surveyData: [],
      positions: []
    }
  },

  methods: {
    run() {
      this.getSurveyData()
      this.getPositions()
    },
    getSurveyData() {
      this.loading = true
      this.$axios.$get(`/survey-data`).then((response) => {
        this.surveyData = response.data
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    },
    getPositions() {
      this.loading = true
      this.$axios.$get(`/positions`).then((response) => {
        this.positions = response.data
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    },
  }
}
</script>
