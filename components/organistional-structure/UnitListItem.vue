<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div>
      <span class="text-gray-600 font-semibold">{{ unit.name }}</span>
    </div>

    <div class="ml-5 text-gray-400">
      {{ unit.description }}
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
            @click="deleteUnit"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <unit-form :unit="unit" @done="close" />
    </base-modal>
  </div>
</template>

<script>
import UnitForm from '../settings/UnitForm.vue'
import BaseModal from '../ui/BaseModal.vue'
export default {
  name: 'DivisionListItem',
  
  components: { BaseModal, UnitForm },

  props: {
    unit: {
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
    deleteUnit() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete unit?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/units/${this.unit.id}`)
            .then(() => {
              this.$toast.success('Unit deleted successfully!')
              this.$nuxt.refresh()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    }
  }
}
</script>
