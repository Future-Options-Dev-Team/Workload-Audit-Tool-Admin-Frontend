<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div>
      <button @click="taskDetailsDialog = true">
        <span class="text-gray-600 font-semibold">{{ task.name }}</span>
      </button>
    </div>

    <div class="ml-5 text-gray-400">
      {{ task.description }}
    </div>

    <div class="ml-auto">
      <v-btn
        outlined
        small
        color="indigo"
        class="ma-2"
        @click="dialog = true"
      >
        Edit
      </v-btn>

      <v-menu
        bottom
        left
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template #activator="{ on, attrs }">
          <v-btn
            light
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <div class="bg-white">
          <button
            class="w-full text-red-500 hover:bg-gray-100 px-4 py-2 text-left flex items-center"
            @click="deleteTask"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <task-form :task="task" @done="close" />
    </base-modal>

    <base-modal :open="taskDetailsDialog" width="500px" @close="close">
      <task-details :task="task" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '../ui/BaseModal.vue'
import TaskDetails from './TaskDetails.vue'
import TaskForm from './TaskForm.vue'
export default {
  name: 'TaskListItem',
  
  components: { BaseModal, TaskForm, TaskDetails },

  props: {
    task: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialog: false,
      taskDetailsDialog: false
    }
  },

  methods: {
    close() {
      this.dialog = false
      this.taskDetailsDialog = false
    },
    deleteTask() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete task?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/tasks/${this.task.id}`)
            .then(() => {
              this.$toast.success('Task deleted successfully!')
              this.$nuxt.refresh()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    }
  }
}
</script>
