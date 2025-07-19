<template>
  <div class="pt-4 border-b border-gray-200">
    <div class="flex w-full items-center">
      <div :class="hasFilters ? 'w-1/2' : 'w-full'" class="relative">
        <v-text-field
          v-if="hasSearch"
          v-model="filters.search"
          :loading="loading"
          :label="`Search ${searchPlaceholder}`"
          :placeholder="`Search ${searchPlaceholder}`"
          solo
          depressed
          prepend-inner-icon="mdi-magnify"
        />
      </div>

      <div v-if="hasFilters" class="ml-auto">
        <button
          v-if="open"
          class="tracking-wide text-red-500 text-xs font-semibold bg-red-100 rounded py-3 px-4 border hover:shadow"
          @click.prevent="toggleFilterMenu"
        >
          <span class="fe fe-x mr-1" /> Close filters
        </button>
        <button
          v-else
          class="tracking-wide text-gray-500 text-xs font-semibold bg-white rounded py-3 px-4 border hover:shadow"
          @click.prevent="toggleFilterMenu"
        >
          <span class="fe fe-filter mr-1" /> Show filters
        </button>
        <button
          v-show="false"
          class="button-primary button button-sm"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>
    <div v-show="open" class="flex items-center mt-4">
      <slot />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'BaseFilters',
  components: { },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    hasFilters: {
      type: Boolean,
      default: true
    },
    alwaysOpen: {
      type: Boolean,
      default: false
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'candidates'
    },
    loading: {
      type: Boolean,
      default: false
    },
    fullScreenSearch: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      open: this.alwaysOpen,
      filters: {
        search: null
      }
    }
  },

  watch: {
    options: {
      deep: true,
      handler () {
        this.setFilters(this.options)
        this.$emit('filterChanged')
      }
    },

    'filters.search' () {
      if (this.filters.search !== '') {
        this.debouncedSearch({ search: this.filters.search })
      } else {
        this.filters.search = null
      }
    }
  },

  created () {
    this.debouncedSearch = debounce(this.search, 1500)
  },

  methods: {
    toggleFilterMenu () {
      this.open = !this.open
    },
    search (value) {
      this.$store.commit('filters/clear')
      this.$store.commit('pagination/setPage', 1)
      this.setFilter(value)
    },
    setFilters (filters) {
      this.$store.commit('filters/addMany', filters)
      this.$store.commit('pagination/setPage', 1)
      this.$emit('filterChanged')
    },
    setFilter (value) {
      this.$store.commit('filters/addOne', value)
      this.$emit('filterChanged')
    },
    clearFilters () {
      this.$store.commit('filters/clear')
      this.toggleFilterMenu()
      this.$emit('filterChanged')
    }
  }
}
</script>
