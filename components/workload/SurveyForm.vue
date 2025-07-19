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

      <div v-for="index in participants" :key="index" class="mt-5 py-3 px-4 border rounded">
        <div class="flex">
          <div class="ml-auto mb-3">
            <v-btn
              v-if="participants > 1"
              icon
              dark
              small
              color="orange darken-4"
              @click="removeParticipant(index)"
            >
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <v-autocomplete
          :value="newParticipants[index - 1].position_id"
          :items="positions"
          outlined
          light
          dense
          label="Choose position"
          :item-text="getItemText"
          item-value="id"
          @input="storeInput($event, index, 'position_id')"
        >
          <template #selection="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
          <template #item="data">
            {{ `${data.item.name} - ${data.item.code}` }}
          </template>
        </v-autocomplete>

        <v-text-field
          :value="newParticipants[index - 1].number_of_hours"
          :error-messages="createForm(index - 1).errors.get('number_of_hours')"
          outlined
          dense
          light
          label="Number of hours"
          @input="storeInput($event, index, 'number_of_hours')"
        ></v-text-field>
      </div>

      <div class="mt-3 flex mb-10">
        <v-btn
          link
          outlined
          color="primary"
          @click="addParticipant"
        >
        <v-icon left>mdi-plus</v-icon>
        Add a field</v-btn>

        <div class="ml-auto">
          <v-btn
            :loading="loading"
            link
            depressed
            color="primary"
            @click="submit"
          >
          <v-icon left>mdi-check</v-icon>
          Submit</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
export default {
  name: 'SurveyForm',

  props: {
    task: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      positions: [],
      participants: 1,
      newParticipants: [{
        task_id: this.task.id,
        position_id: '',
        number_of_hours: ''
      }],
    }
  },

  mounted() {
    this.getPositions()
    this.getTaskSurveys()
  },

  methods: {
    getItemText(item) {
      return `${item.name} - ${item.code}`;
    },
    createForm(index) {
      return this.$form(this.newParticipants[index])
    },
    addParticipant() {
      this.participants += 1
      this.addToParticipantArray()
    },
    removeParticipant(index) {
      this.participants -= 1
      this.clearParticipantFromArray(index - 1)
    },
    addToParticipantArray() {
      this.newParticipants.push({
        task_id: this.task.id,
        position_id: '',
        number_of_hours: ''
      })
    },
    clearParticipantFromArray(index) {
      if(index <= this.newParticipants.length) {
        this.newParticipants.splice(index, 1)
      }
    },
    storeInput(input, index, field) {
      if(index <= this.newParticipants.length) {
        this.newParticipants[index - 1][field] = input
      }
    },
    getTaskSurveys() {
      this.loading = true
      this.$axios.$get(`/position-task-surveys/task/${this.task.id}`)
        .then((response) => {
          if(response.data.length) {
            this.newParticipants = response.data
            this.participants = response.data.length
          }
          this.loading = false
        }).catch((error) => {
          this.$toast.error(error.response.data.message)
          this.loading = false
        })
    },
    submit() {
      this.loading = true
      Promise.all(
        this.newParticipants.map(participant => this.$axios.$post(`/position-task-surveys`, this.$form(participant)))
      ).then(() => {
        this.loading = false
        this.$toast.success('Task survey has been added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.loading = false
        this.$toast.error(error.response.data.message)
      })
      
    },
    getPositions() {
      this.$axios.$get(`/positions`, {
        params: {
          per_page: 3000
        }
      }).then((response) => {
        this.positions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    done() {
      this.$emit('done')
    },
  }
}
</script>

<style>

</style>