<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div>
      <nuxt-link v-if="forWorkloadAudit" :to="`/clients/${$route.params.id}/activity/${activity.id}`">
        <span class="text-gray-600 font-semibold">{{ activity.activity_number }}: {{ activity.name }}</span>
      </nuxt-link>
      <nuxt-link v-else :to="`/activities/${activity.id}`">
        <span class="text-gray-600 font-semibold">{{ activity.activity_number }}: {{ activity.name }}</span>
      </nuxt-link>
      <div class="text-gray-400">
        {{ activity.directorate.name }}
        <span v-if="activity.department">
          <v-icon>mdi-menu-right</v-icon>
          {{ activity.department.name }}
        </span>
        <span v-if="activity.unit">
          <v-icon>mdi-menu-right</v-icon>
          {{ activity.unit.name }}
        </span>
      </div>
    </div>

    <div class="ml-5 text-gray-400">
      {{ activity.description }}
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
            @click="deleteActivity"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <activity-form :activity="activity" @done="close" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '../ui/BaseModal.vue'
import ActivityForm from './ActivityForm.vue'
export default {
  name: 'ActivityListItem',
  
  components: { BaseModal, ActivityForm },

  props: {
    activity: {
      type: Object,
      required: true
    },
    forWorkloadAudit: {
      type: Boolean,
      default: false
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
    deleteActivity() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete activity?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/activities/${this.activity.id}`)
            .then(() => {
              this.$toast.success('Activity deleted successfully!')
              this.$nuxt.refresh()
              this.$store.dispatch('activities/fetchAll')
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    }
  }
}
</script>
