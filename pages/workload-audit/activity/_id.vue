<template>
  <div>
    <div class="flex items-center">
      <button class="py-2 px-3" @click="$router.go(-1)">
        <v-icon>mdi-menu-left</v-icon>
      </button>

      <div class="ml-auto">
        <v-btn 
          :loading="loading"
          depressed 
          color="primary"
          @click="publishLinks"
        >
          <v-icon left>mdi-plus</v-icon>
          Publish survey links
        </v-btn>
      </div>
    </div>
    <div class="mt-5 text-lg text-gray-600 font-semibold py-3 border-t border-b">
      {{ activity.directorate.name }}
    </div>
    <div class="py-3 text-gray-600 border-b font-medium">
      {{ activity.unit.name }}
    </div>
    <div class="py-3 flex">
      <div class="w-1/4 font-semibold">
        {{ activity.name }}
      </div>
      <div class="w-1/2 ml-8">
        Responsibility & Time
      </div>
      <div class="w-64">
        Workload driver
      </div>
      <div class="w-64 ml-2"/>
    </div>
    <div v-for="task in activity.tasks" :key="task.id" class="ml-4 py-3 text-gray-500 flex">
      <div class="w-1/4 flex items-center">
        <v-icon>mdi-arrow-right-thin</v-icon>
        <div class="ml-3">{{ task.name }}</div>
      </div>
      <div class="w-1/2 ml-4">
        <div class="grid grid-cols-8 gap-2">
          <div
            v-for="position in task.positions" :key="position.id"
            class="mr-1 border border-gray-300 rounded overflow-hidden relative"
          >
            <span
              class="block bg-gray-200 border-b border-gray-300 py-1 px-2 cursor-pointer"
              @click="deletePosition(position.id, task.id)"
            >
              {{ position.code }}
            </span>
            <div class="relative">
              <div class="px-2 py-1">
                {{ position.position_task_survey.length ? position.position_task_survey[0].number_of_hours : '' }}
              </div>
            </div>
          </div>
          <v-btn
            fab
            dark
            outlined
            ou
            x-small
            color="orange darken-4"
            @click="taskDetail(task)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="w-64 mt">
        <div class="flex items-center">
          <v-text-field
            :value="task.workload_driver ? task.workload_driver.workload_driver : ''"
            dense
            outlined
            hide-details
            @change="saveWorkloadDriver($event, task)"
          ></v-text-field>
          <v-btn
            v-if="activity.split_workload_driver"
            fab
            dark
            plain
            ou
            x-small
            color="orange darken-4"
            @click="splitWorkload(task)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="w-64 ml-2">
        <v-textarea
          :value="task.workload_driver ? task.workload_driver.description : ''"
          dense
          outlined
          hide-details
          rows="1"
          label="Description"
          @change="saveWorkloadDriverDescription($event, task)"
        ></v-textarea>
      </div>
    </div>
    <base-modal :open="taskDetailsDialog" width="500px" @close="taskDetailsDialog = false">
      <survey-form :task="singleTask" @done="taskDetailsDialog = false" />
    </base-modal>

    <base-modal :open="splitWorkloadDialog" width="500px" @close="splitWorkloadDialog = false">
      <split-workload-form :task="singleTask" @done="splitWorkloadDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '~/components/ui/BaseModal.vue'
import SplitWorkloadForm from '~/components/workload/SplitWorkloadForm.vue'
import SurveyForm from '~/components/workload/SurveyForm.vue'
export default {
  name: 'ActivityTasks',

  components: { BaseModal, SurveyForm, SplitWorkloadForm },

  async asyncData({ $axios, params }) {
    const activity = await $axios.$get(`activities/${params.id}`)

    return {
      activity: activity.data
    }
  },

  data() {
    return {
      loading: false,
      taskDetailsDialog: false,
      splitWorkloadDialog: false,
      singleTask: null
    }
  },

  methods: {
    taskDetail(task) {
      this.taskDetailsDialog = true
      this.singleTask = task
    },

    splitWorkload(task) {
      this.splitWorkloadDialog = true
      this.singleTask = task
    },

    saveWorkloadDriver(input, task) {
      task.workload_driver
        ? this.update({ workload_driver: input }, task.workload_driver.id)
        : this.add({ task_id: task.id, workload_driver: input })
    },

    saveWorkloadDriverDescription(input, task) {
      task.workload_driver
        ? this.update({ description: input }, task.workload_driver.id)
        : this.add({ task_id: task.id, description: input })
    },

    add(data) {
      this.$axios.$post('task-workload-drivers', data)
        .then((res) => {
          this.$toast.success('Saved!')
          this.$nuxt.refresh()
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
    },

    update(data, id) {
      this.$axios.$patch(`task-workload-drivers/${id}`, data)
        .then((res) => {
          this.$toast.success('Saved!')
          this.$nuxt.refresh()
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
    },

    publishLinks() {
      this.$swal.fire({
        title: 'Please confirm publish!',
        text: 'Are you sure want to publish survey links to participants?',
        showCancelButton: true,
        confirmButtonText: 'Yes, publish!',
        preConfirm: () => {
          this.loading = true
          return this.$axios
            .$get(`/publish-survey-links`, {
              params: {
                activity_id: this.$route.params.id
              }
            })
            .then(() => {
              this.loading = false
              this.$toast.success('Survey links published successfully!')
            })
            .catch((error) => {
              this.loading = false
              this.$toast.error(error.response.data.message)
            })
        },
      })
    },
    deletePosition(participant, task) {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          this.loading = true
          return this.$axios
            .$post(`/tasks/${task}/detach-participant`, { participant })
            .then(() => {
              this.$nuxt.refresh()
              this.loading = false
              this.$toast.success('Deleted successfully!')
            })
            .catch((error) => {
              this.loading = false
              this.$toast.error(error.response.data.message)
            })
        }
      })
    }
  }
}
</script>
