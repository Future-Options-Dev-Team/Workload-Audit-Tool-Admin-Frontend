<template>
  <div class="text-gray-500">
    <div class="text-lg text-gray-600 font-semibold mb-5 bg-gray-100 px-4 py-3 border-b">
      {{ formTitle }}
    </div>
    <div class="p-4">
      <v-autocomplete
        v-model="form.activity_id"
        :error-messages="form.errors.get('activity_id')"
        :items="activities"
        dense
        outlined
        light
        label="Activity"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-text-field
        v-model="form.number_of_participants"
        :error-messages="form.errors.get('number_of_participants')"
        outlined
        dense
        light
        label="Number of participants"
      ></v-text-field>

      <v-text-field
        v-model="form.number_of_hours"
        :error-messages="form.errors.get('number_of_hours')"
        outlined
        dense
        light
        label="Number of hours"
      ></v-text-field>

      <v-textarea
        v-model="form.workload_driver"
        outlined
        light
        label="Workload drivers"
      ></v-textarea>

      <div class="mt-5 border-t py-4 flex">
        <div class="ml-auto">
          <v-btn :loading="form.submitting" depressed color="primary" @click="submit">
            {{ formTitle }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import forIn from 'lodash/forIn'
export default {
  name: 'PredeterminedWorkloadForm',

  props: {
    workload: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: this.$form({
        activity_id: '',
        number_of_participants: '',
        number_of_hours: '',
        workload_driver: ''
      }),
      activities: []
    }
  },

  computed: {
    formTitle() {
      return this.workload ? 'Update workload' : 'Record new workload'
    }
  },

  mounted() {
    this.getActivities()
    if(this.workload) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.workload ? this.update() : this.add()
    },

    add() {
      this.form.post('/predetermined-workloads').then((response) => {
        this.$toast.success('Workload added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
        this.done()
      })
    },

    update() {
      this.form.patch(`/predetermined-workloads/${this.workload.id}`).then((response) => {
        this.$toast.success('Workload updated successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
        this.done()
      })
    },

    done() {
      this.$emit('done')
    },

    getActivities() {
      this.$axios.$get(`/activities`).then((response) => {
        this.activities = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    populateForm() {
      forIn(this.workload, (value, key) => {
        if (this.isObject(this.workload[key])) {
          this.form[key] = this.workload[key].id
        }

        this.form[key] = this.workload[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
