<template>
  <div class="flex my-4 text-sm">
    <div v-for="(item, index) in items" :key="item.name">
      <div
        v-if="index < items.length - 1"
        :class="getItemSpacing(index)"
        class="flex"
      >
        <nuxt-link :to="item.to">{{ item.label }}</nuxt-link>
        <v-icon v-if="index < items.length - 1" small class="ml-2"
          >mdi-chevron-right</v-icon
        >
      </div>
      <div v-else :class="getItemSpacing(index)" class="flex text-gray-500">
        <span>{{ item.label }}</span>
        <v-icon v-if="index < items.length - 1" small class="ml-2"
          >mdi-chevron-right</v-icon
        >
      </div>
    </div>
  </div>
</template>
  
  
  <script>
export default {
  name: 'BaseBreadcrumb',

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getItemSpacing(index) {
      return {
        'ml-2': index > 0,
      }
    },
  },
}
</script>
