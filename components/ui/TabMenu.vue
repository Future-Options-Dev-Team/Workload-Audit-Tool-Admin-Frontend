<template>
  <div class="page-tabs mt-5 flex items-center bg-white px-4 rounded-lg border">
    <ul class="tab-menu flex">
      <li v-for="item in items" :key="item.name" class="menu-item">
        <nuxt-link :to="item.to" :exact="item.exact">{{ item.name }}</nuxt-link>
      </li>
    </ul>
    <div class="ml-auto flex">
      <nuxt-link
        v-if="button.label"
        :to="button.link"
        :class="buttonColor"
        class="text-gray-100 px-4 py-2 rounded flex items-center font-semibold hover:no-underline "
      >
        <span :class="`fe fe-${icon} mr-1 text-gray-100 text-lg`" />
        <span class="text-gray-100">{{ button.label }}</span>
      </nuxt-link>

      <nuxt-link
        v-if="secondaryButton.label"
        :to="secondaryButton.link"
        :class="buttonColor"
        class="text-gray-100 px-4 py-2 rounded flex items-center font-semibold hover:no-underline ml-2"
      >
        <span :class="`fe fe-${icon} mr-1 text-gray-100 text-lg`" />
        <span class="text-gray-100">{{ secondaryButton.label }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabMenu',

  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    button: {
      type: Object,
      default: () => {
        return {}
      }
    },
    secondaryButton: {
      type: Object,
      default: () => {
        return {}
      }
    },
    buttonType: {
      type: String,
      default: 'success'
    }
  },

  computed: {
    icon() {
      return this.button.icon ? this.button.icom : 'plus'
    },
    buttonColor() {
      const colors = {
        'success': 'bg-green-600 hover:bg-green-500',
        'error': 'bg-red-600 hover:bg-red-500'
      }

      return colors[this.buttonType]
    }
  }
}
</script>

<style scoped lang="less">
.border-primary {
  border-color: #E46805;
}

.text-primary {
  color: #E46805;
}
.tab-menu {
  @apply m-0 p-0;
  .menu-item {
    @apply mt-0 outline-none mr-5;
    .fe {
      @apply mr-1 text-gray-400;
    }
    a {
      @apply inline-block w-full text-sm text-gray-400 py-3 px-1 font-medium;
    }
    a:hover {
      @apply text-primary no-underline border-b-2 border-primary;
    }
    a.nuxt-link-active {
      @apply text-sm text-primary font-medium no-underline border-b-2 border-primary;
    }
    a:hover .fe, a.nuxt-link-active .fe {
      @apply text-green-800;
    }
  }
}
</style>
