<template>
  <div
    class="flex items-center w-full py-1 row text-md font-semibold"
  >
    <div class="text-gray-400 col-md-6 text-sm font-medium">
      {{ `Showing ${pagination.from} to ${pagination.to}` }} of {{ pagination.total }}
      {{ resource }}
    </div>
    <div class="ml-auto">
      <ul
        v-show="pagination.last_page > 1"
        class="text-blue-700 flex items-center ml-auto"
      >
        <BaseButton
          :disabled="isPreviousButtonDisabled"
          @click.native="previousPage"
        >
          ←
        </BaseButton>

        <li
          v-for="(paginationTrigger, key) in paginationTriggers"
          :key="key"
          :class="{
            'font-medium bg-blue-600 px-4 py-1 text-white': paginationTrigger === currentPage
          }"
          class="px-4 py-1 cursor-pointer border border-blue-600 rounded mr-1 hover:bg-blue-600 hover:text-gray-100 text-sm"
          @click="onLoadPage(paginationTrigger)"
        >
          {{ paginationTrigger }}
        </li>

        <BaseButton :disabled="isNextButtonDisabled" @click.native="nextPage">
          →
        </BaseButton>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseButton from './BaseButton.vue'

export default {
  name: 'BasePagination',

  components: {
    BaseButton
  },

  props: {
    perPage: {
      type: Number,
      default: 8
    },
    resource: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    ...mapState({ pagination: (state) => state.pagination.all }),

    pageCount() {
      return this.pagination.last_page
    },

    currentPage() {
      return this.pagination.current_page
    },

    isPreviousButtonDisabled() {
      return this.currentPage === 1
    },

    isNextButtonDisabled() {
      return this.currentPage === this.pageCount
    },

    visiblePagesCount() {
      if (this.pagination.last_page < 5) {
        return this.pagination.last_page
      }
      return 5
    },

    paginationTriggers() {
      const currentPage = this.currentPage
      const pageCount = this.pageCount
      const visiblePagesCount = this.visiblePagesCount
      const visiblePagesThreshold = (visiblePagesCount - 1) / 2
      const paginationTriggersArray = Array(this.visiblePagesCount - 1).fill(0)

      if (currentPage <= visiblePagesThreshold + 1) {
        paginationTriggersArray[0] = 1
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => paginationTriggersArray[0] + index
        )

        paginationTriggers.push(pageCount)

        return paginationTriggers
      }

      if (currentPage >= pageCount - visiblePagesThreshold + 1) {
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => pageCount - index
        )

        paginationTriggers.reverse().unshift(1)

        return paginationTriggers
      }

      paginationTriggersArray[0] = currentPage - visiblePagesThreshold + 1
      const pagintationTriggers = paginationTriggersArray.map(
        (paginationTrigger, index) => paginationTriggersArray[0] + index
      )

      pagintationTriggers.unshift(1)
      pagintationTriggers[pagintationTriggers.length - 1] = pageCount

      return pagintationTriggers
    }
  },

  created() {
    this.$store.commit('pagination/setPerPage', this.perPage)
  },

  methods: {
    nextPage() {
      this.$store.commit('pagination/nextPage')
      this.$emit('changePage')
    },

    onLoadPage(value) {
      this.$store.commit('pagination/changePage', value)
      this.$emit('changePage')
    },

    previousPage() {
      this.$store.commit('pagination/prevPage')
      this.$emit('changePage')
    }
  }
}
</script>
