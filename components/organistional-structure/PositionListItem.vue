<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div class="w-1/4">
      <span class="text-gray-600 font-semibold">{{ position.name }}</span>
    </div>

    <div class="ml-4 w-30">
      <span class="text-gray-500 font-semibold">{{ position.code }}</span>
    </div>

    <div class="ml-5 text-gray-400 w-1/2">
      {{ truncateText(position.description, 70) }}
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
            @click="deletePosition"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <position-form :position="position" @done="close" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '../ui/BaseModal.vue'
import PositionForm from './PositionForm.vue'
export default {
  name: 'PositionListItem',
  
  components: { BaseModal, PositionForm },

  props: {
    position: {
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
    deletePosition() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete position?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/positions/${this.position.id}`)
            .then(() => {
              this.$toast.success('Position deleted successfully!')
              this.$nuxt.refresh()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    },
    truncateText(text, length) {
      if (text && text.length > length) {
        return text.substring(0, length) + "...";
      } else {
        return text;
      }
    }
  }
}
</script>
