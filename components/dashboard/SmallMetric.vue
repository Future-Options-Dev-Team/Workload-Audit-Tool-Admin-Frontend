<template>
  <div class="rounded-lg p-4 border-b-2 border-yellow-600 bg-white shadow-sm">
    <span class="text-gray-400">{{ title }}</span>

    <div v-if="loading" class="mt-3">
      <v-progress-circular
        indeterminate
        size="24"
        width="1"
        color="orange"
      ></v-progress-circular>
    </div>
    <div v-else class="mt-3 text-xl font-bold text-gray-600">{{ value | number_format }}</div>
  </div>
</template>

<script>
export default {
  name: 'SmallMetric',

  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      data: null
    }
  },

  computed: {
    value() {
      return this.data ? this.data.meta.total : 0
    }
  },

  mounted() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.loading = true
      this.$axios.$get(this.url).then((response) => {
        this.data = response
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>