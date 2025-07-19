<template>
  <div>
    {{ unit }}
  </div>
</template>

<script>
export default {
  name: 'UnitSurveyPage',

  async asyncData({ $axios, params }) {
    const unit = await $axios.$get(`units/${params.unit}`)

    return {
      unit: unit.data
    }
  }
}
</script>
