<template>
  <div class="bg-white px-4 py-3 rounded flex items-center shadow-sm mt-3">
    <div>
      <nuxt-link :to="`/clients/${client.id}`">
        <span class="text-gray-600 font-semibold">{{ client.name }}</span>
      </nuxt-link>
      <div class="grid grid-cols-4 gap-4 mt-2">
        <div class="flex">
          <v-icon small>mdi-phone</v-icon>
          <span class="ml-1 text-gray-400 text-sm">{{ client.phone }}</span>
        </div>

        <div class="flex">
          <v-icon small>mdi-email</v-icon>
          <span class="ml-1 text-gray-400 text-sm">{{ client.email }}</span>
        </div>

        <div class="flex">
          <v-icon small>mdi-map</v-icon>
          <span class="ml-1 text-gray-400 text-sm">{{ client.address }}</span>
        </div>
      </div>
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
            @click="deleteClient"
          >
            <span class="fe fe-trash mr-2" />
            Delete
          </button>
        </div>
      </v-menu>
    </div>

    <base-modal :open="dialog" width="500px" @close="close">
      <client-form :client="client" @done="done" />
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '../ui/BaseModal.vue'
import ClientForm from './ClientForm.vue'
export default {
  name: 'ClientListItem',
  
  components: { BaseModal, ClientForm },

  props: {
    client: {
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
    deleteClient() {
      this.$swal.fire({
        title: 'Please confirm delete!',
        text: 'Are you sure want to delete client?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        preConfirm: () => {
          return this.$axios
            .$delete(`/clients/${this.client.id}`)
            .then(() => {
              this.$toast.success('Client deleted successfully!')
              this.$nuxt.refresh()
            })
            .catch((error) => this.$toast.error(error.response.data.message))
        },
      })
    },

    done() {
      this.close()
      this.$nuxt.refresh()
    }
  }
}
</script>
