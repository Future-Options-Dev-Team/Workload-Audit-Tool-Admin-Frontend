<template>
  <div>
    <div class="mt-3 text-gray-600 font-bold text-2xl"><span class="font-semibold text-gray-500">Welcome back,</span> {{ user.name }}</div>

    <div class="text-gray-400">Let's Audit</div>

    <!-- <div class="mt-5 grid grid-cols-4 gap-4">
      <small-metric title="Directorates" url="/directorates" />

      <small-metric title="Units" url="/units" />

      <small-metric title="Activities" url="/activities" />

      <small-metric title="Tasks" url="/tasks" />
    </div> -->

    <div class="mt-8 grid grid-cols-2 gap-4">
      <div class="px-4 py-32 border-2 border-gray-300 border-dashed rounded-lg">
        <div class="text-gray-400 font-bold text-center">
          Metric One
        </div>
      </div>

      <div class="px-4 py-32 border-2 border-gray-300 border-dashed rounded-lg">
        <div class="text-gray-400 font-bold text-center">
          Metric Two
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import SmallMetric from '~/components/dashboard/SmallMetric.vue'
export default {
  name: 'IndexPage',

  components: {
    // SmallMetric
  },

  data() {
    return {
      user: this.$auth.user
    }
  }
}
</script>
