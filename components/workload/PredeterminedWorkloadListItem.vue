<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div class="w-1/2">
      <span class="text-gray-600 font-semibold">{{ workload.activity.name }}</span>
    </div>

    <div class="w-48">
      <span class="block uppercase text-xs font-medium text-gray-400">Number of participants</span>
      <span class="text-gray-500 font-medium">{{ workload.number_of_participants }}</span>
    </div>

    <div class="w-48">
      <span class="block uppercase text-xs font-medium text-gray-400">Number of hours</span>
      <span class="text-gray-500 font-medium">{{ workload.number_of_hours }}</span>
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
            @click="deleteWorkload"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <predetermined-workload-form :workload="workload" @done="close" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '../ui/BaseModal.vue'
import PredeterminedWorkloadForm from './PredeterminedWorkloadForm.vue'
export default {
  name: 'PredeterminedWorkloadListItem',

  components: { PredeterminedWorkloadForm, BaseModal },

  props: {
    workload: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialog: false
    }
  },

  methods: {
    close() {
      this.dialog = false
    },
    deleteWorkload() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete workload?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/predetermined-workloads/${this.workload.id}`)
            .then(() => {
              this.$toast.success('Workload deleted successfully!')
              this.$nuxt.refresh()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    }
  }
}
</script>
