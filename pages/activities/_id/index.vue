<template>
  <div>
    <div class="mt-3">
      <button class="py-2 px-3" @click="$router.go(-1)">
        <v-icon>mdi-menu-left</v-icon>
      </button>
    </div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          {{ activity.name }}
        </span>
        <p class="text-gray-400">{{ activity.description }}</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newTaskDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add new task
        </v-btn>
      </div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="tasks"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <task-list-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>

    <div v-if="tasks.length" class="mt-6">
      <base-pagination resource="Tasks" @changePage="pageChangeHandler" />
    </div>

    <base-modal :open="newTaskDialog" width="500px" @close="newTaskDialog = false">
      <task-form @done="newTaskDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskForm from '~/components/activities/TaskForm.vue'
import TaskListItem from '~/components/activities/TaskListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
export default {
  name: 'SingleActivity',

  components: { BaseFilters, BaseModal, BasePagination, TaskForm, TaskListItem },

  async asyncData({ $axios, params }) {
    const activity = await $axios.$get(`/activities/${params.id}`)

    return {
      activity: activity.data
    }
  },

  data() {
    return {
      newTaskDialog: false,
      loading: false,
      filters: {}
    }
  },

  async fetch({ store, params }) {
    await store.dispatch('filters/reset')
    await store.dispatch('activities/fetchTasks', params.id)
  },

  computed: {
    ...mapState({ tasks: (state) => state.activities.tasks })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('activities/fetchTasks', this.activity.id)
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>