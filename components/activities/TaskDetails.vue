<template>
  <div>
    <div class="px-4 py-3">
      <div class="text-lg text-gray-600 font-semibold">{{ task.name }}</div>
      <p class="text-gray-400 text-sm">{{ task.description }}</p>
    </div>

    <div class="mt-2 border-t px-4">
      <div class="mt-5 font-bold text-gray-400">
        Participants
      </div>

      <div class="mt-5">
        <v-autocomplete
          v-model="form.participants"
          :items="positions"
          filled
          chips
          multiple
          light
          color="blue-grey lighten-2"
          label="Choose positions"
          item-text="name"
          item-value="id"
        >
          <template #selection="data">
            <v-chip
              v-bind="data.attrs"
              close
              label
              outlined
              color="primary"
              @click:close="remove(data.item)"
            >
              <v-avatar left>
                <span class="font-semibold bg-gray-200 px-2 py-1">{{ data.item.code }}</span>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template #item="data">
            <v-list-item-avatar>
              <span class="font-semibold bg-gray-200 px-2 p-1 rounded-sm">{{ data.item.code }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ data.item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </div>
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
export default {
  name: 'TaskDetails',

  props: {
    task: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      positions: [],
      form: this.$form({
        participants: []
      })
    }
  },

  watch: {
    'form.participants': {
      handler() {
        this.syncParticipants()
      },
      immediate: false
    }
  },

  mounted() {
    this.getPositions()
    this.updateForm()
  },

  methods: {
    syncParticipants() {
      this.$axios.$post(`/tasks/${this.task.id}/sync-participants`, this.form).then((response) => {
        this.$toast.success('Participants have been updated successfully!')
        this.$nuxt.refresh()
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },
    getPositions() {
      this.$axios.$get(`/positions`).then((response) => {
        this.positions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },
    remove (item) {
      const index = this.form.participants.indexOf(item.id)
      if (index >= 0) this.form.participants.splice(index, 1)
    },
    updateForm() {
      this.form.participants = this.task.positions.map((p) => p.id)
    }
  }
}
</script>

<style>

</style>