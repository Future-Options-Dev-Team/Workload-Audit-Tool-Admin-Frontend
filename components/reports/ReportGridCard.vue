<template>
  <nuxt-link :to="url" class="rounded bg-white shadow-sm px-4 py-3 hover:shadow-lg">
    <label class="text-2xl font-medium text-gray-600 capitalize">
      <span class="fe fe-file-text" />
      {{ title }}
    </label>
    <p class="text-gray-400 mt-2">{{ description }}</p>
    <div class="flex mt-2">
      <nuxt-link :to="url" class="ml-auto">View report</nuxt-link>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'ReportGridCard',

  props: {
    title: {
      type: String,
      default: 'Report'
    },
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/'
    }
  }
}
</script>
