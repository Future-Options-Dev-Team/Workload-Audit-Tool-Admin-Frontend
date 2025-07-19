<template>
  <div class="text-gray-500">
    <div class="text-lg text-gray-600 font-semibold mb-5 bg-gray-100 px-4 py-3 border-b">
      {{ formTitle }}
    </div>
    <div class="p-4">
      <v-autocomplete
        v-model="form.division_id"
        :error-messages="form.errors.get('division_id')"
        :items="divisions"
        dense
        outlined
        light
        label="Division"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.directorate_id"
        :error-messages="form.errors.get('directorate_id')"
        :items="directorates"
        dense
        outlined
        light
        label="Directorate"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.department_id"
        :error-messages="form.errors.get('department_id')"
        :items="departments"
        :loading="loadingDepartments"
        dense
        outlined
        light
        label="Department"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.unit_id"
        :error-messages="form.errors.get('unit_id')"
        :items="units"
        :loading="loadingUnits"
        dense
        outlined
        light
        label="Unit"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.section_id"
        :error-messages="form.errors.get('section_id')"
        :items="sections"
        :loading="loadingSections"
        dense
        outlined
        light
        label="Section"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.activity_number"
        :error-messages="form.errors.get('activity_number')"
        :items="activityNumbers"
        dense
        outlined
        light
        label="Activity number"
      ></v-autocomplete>

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Activity name"
      ></v-text-field>

      <v-text-field
        v-model="form.description"
        :error-messages="form.errors.get('description')"
        outlined
        dense
        light
        label="Description (Optional)"
      ></v-text-field>

      <v-autocomplete
        v-model="form.activity_frequency"
        :error-messages="form.errors.get('activity_frequency')"
        :items="frequencies"
        dense
        outlined
        light
        label="Activity frequency"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-autocomplete
        v-model="form.effort_level"
        :error-messages="form.errors.get('effort_level')"
        :items="effortLevels"
        dense
        outlined
        light
        label="Effort level"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-switch
        v-model="form.split_workload_driver"
        label="Split task workload driver"
        color="primary"
        light
        hide-details
      ></v-switch>

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
  name: 'ActivityForm',

  props: {
    activity: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      startDateMenu: false,
      deadlineMenu: false,
      showPassword: false,
      dateDialog: false,
      loadingDepartments: false,
      loadingUnits: false,
      loadingSections: false,
      form: this.$form({
        division_id: '',
        directorate_id: '',
        department_id: '',
        unit_id: '',
        section_id: '',
        activity_number: '',
        name: '',
        description: '',
        activity_frequency: '',
        effort_level: '',
        workload_driver: '',
        split_workload_driver: false
      }),
      divisions: [],
      directorates: [],
      departments: [],
      units: [],
      sections: [],
      frequencies: [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'monthly', name: 'Monthly' },
        { id: 'quarterly', name: 'Quarterly' },
        { id: 'yearly', name: 'Yearly' }
      ],
      effortLevels: [
        { id: 'easy', name: 'Easy' },
        { id: 'moderate', name: 'Moderate' },
        { id: 'complex', name: 'Complex' }
      ],
      activityNumbers: [
        'Activity 1',
        'Activity 1.1',
        'Activity 1.2',
        'Activity 1.3',
        'Activity 1.4',
        'Activity 1.5',
        'Activity 1.6',
        'Activity 1.7',
        'Activity 1.8',
        'Activity 1.9',
        'Activity 1.10',
        'Activity 1.11',
        'Activity 1.12',
        'Activity 1.13',
        'Activity 1.14',
        'Activity 1.15',
        'Activity 1.16',
        'Activity 2',
        'Activity 2.1',
        'Activity 2.2',
        'Activity 2.3',
        'Activity 2.4',
        'Activity 2.5',
        'Activity 2.6',
        'Activity 2.7',
        'Activity 2.8',
        'Activity 2.9',
        'Activity 2.10',
        'Activity 2.11',
        'Activity 2.12',
        'Activity 2.13',
        'Activity 2.14',
        'Activity 2.15',
        'Activity 2.16',
        'Activity 3',
        'Activity 3.1',
        'Activity 3.2',
        'Activity 3.3',
        'Activity 3.4',
        'Activity 3.5',
        'Activity 3.6',
        'Activity 3.7',
        'Activity 3.8',
        'Activity 3.9',
        'Activity 3.10',
        'Activity 3.11',
        'Activity 3.12',
        'Activity 3.13',
        'Activity 3.14',
        'Activity 3.15',
        'Activity 3.16',
        'Activity 4',
        'Activity 4.1',
        'Activity 4.2',
        'Activity 4.3',
        'Activity 4.4',
        'Activity 4.5',
        'Activity 4.6',
        'Activity 4.7',
        'Activity 4.8',
        'Activity 4.9',
        'Activity 4.10',
        'Activity 4.11',
        'Activity 4.12',
        'Activity 4.13',
        'Activity 4.14',
        'Activity 4.15',
        'Activity 4.16',
        'Activity 5',
        'Activity 5.1',
        'Activity 5.2',
        'Activity 5.3',
        'Activity 5.4',
        'Activity 5.5',
        'Activity 5.6',
        'Activity 5.7',
        'Activity 5.8',
        'Activity 5.9',
        'Activity 5.10',
        'Activity 5.11',
        'Activity 5.12',
        'Activity 5.13',
        'Activity 5.14',
        'Activity 5.15',
        'Activity 5.16',
        'Activity 6',
        'Activity 6.1',
        'Activity 6.2',
        'Activity 6.3',
        'Activity 6.4',
        'Activity 6.5',
        'Activity 6.6',
        'Activity 6.7',
        'Activity 6.8',
        'Activity 6.9',
        'Activity 6.10',
        'Activity 6.11',
        'Activity 6.12',
        'Activity 6.13',
        'Activity 6.14',
        'Activity 6.15',
        'Activity 6.16',
        'Activity 7',
        'Activity 7.1',
        'Activity 7.2',
        'Activity 7.3',
        'Activity 7.4',
        'Activity 7.5',
        'Activity 7.6',
        'Activity 7.7',
        'Activity 7.8',
        'Activity 7.9',
        'Activity 7.10',
        'Activity 7.11',
        'Activity 7.12',
        'Activity 7.13',
        'Activity 7.14',
        'Activity 7.15',
        'Activity 7.16',
        'Activity 8',
        'Activity 8.1',
        'Activity 8.2',
        'Activity 8.3',
        'Activity 8.4',
        'Activity 8.5',
        'Activity 8.6',
        'Activity 8.7',
        'Activity 8.8',
        'Activity 8.9',
        'Activity 8.10',
        'Activity 8.11',
        'Activity 8.12',
        'Activity 8.13',
        'Activity 8.14',
        'Activity 8.15',
        'Activity 8.16',
        'Activity 9',
        'Activity 9.1',
        'Activity 9.2',
        'Activity 9.3',
        'Activity 9.4',
        'Activity 9.5',
        'Activity 9.6',
        'Activity 9.7',
        'Activity 9.8',
        'Activity 9.9',
        'Activity 9.10',
        'Activity 9.11',
        'Activity 9.12',
        'Activity 9.13',
        'Activity 9.14',
        'Activity 9.15',
        'Activity 9.16',
        'Activity 10',
        'Activity 10.1',
        'Activity 10.2',
        'Activity 10.3',
        'Activity 10.4',
        'Activity 10.5',
        'Activity 10.6',
        'Activity 10.7',
        'Activity 10.8',
        'Activity 10.9',
        'Activity 10.10',
        'Activity 10.11',
        'Activity 10.12',
        'Activity 10.13',
        'Activity 10.14',
        'Activity 10.15',
        'Activity 10.16',
        'Activity 11',
        'Activity 11.1',
        'Activity 11.2',
        'Activity 11.3',
        'Activity 11.4',
        'Activity 11.5',
        'Activity 11.6',
        'Activity 11.7',
        'Activity 11.8',
        'Activity 11.9',
        'Activity 11.10',
        'Activity 11.11',
        'Activity 11.12',
        'Activity 11.13',
        'Activity 11.14',
        'Activity 11.15',
        'Activity 11.16',
        'Activity 12',
        'Activity 12.1',
        'Activity 12.2',
        'Activity 12.3',
        'Activity 12.4',
        'Activity 12.5',
        'Activity 12.6',
        'Activity 12.7',
        'Activity 12.8',
        'Activity 12.9',
        'Activity 12.10',
        'Activity 12.11',
        'Activity 12.12',
        'Activity 12.13',
        'Activity 12.14',
        'Activity 12.15',
        'Activity 12.16',
        'Activity 13',
        'Activity 13.1',
        'Activity 13.2',
        'Activity 13.3',
        'Activity 13.4',
        'Activity 13.5',
        'Activity 13.6',
        'Activity 13.7',
        'Activity 13.8',
        'Activity 13.9',
        'Activity 13.10',
        'Activity 13.11',
        'Activity 13.12',
        'Activity 13.13',
        'Activity 13.14',
        'Activity 13.15',
        'Activity 13.16',
        'Activity 14',
        'Activity 14.1',
        'Activity 14.2',
        'Activity 14.3',
        'Activity 14.4',
        'Activity 14.5',
        'Activity 14.6',
        'Activity 14.7',
        'Activity 14.8',
        'Activity 14.9',
        'Activity 14.10',
        'Activity 14.11',
        'Activity 14.12',
        'Activity 14.13',
        'Activity 14.14',
        'Activity 14.15',
        'Activity 14.16',
        'Activity 15',
        'Activity 15.1',
        'Activity 15.2',
        'Activity 15.3',
        'Activity 15.4',
        'Activity 15.5',
        'Activity 15.6',
        'Activity 15.7',
        'Activity 15.8',
        'Activity 15.9',
        'Activity 15.10',
        'Activity 15.11',
        'Activity 15.12',
        'Activity 15.13',
        'Activity 15.14',
        'Activity 15.15',
        'Activity 15.16',
      ]
    }
  },

  computed: {
    formTitle() {
      return this.activity ? 'Update activity' : 'Add new activity'
    }
  },

  watch: {
    'form.directorate_id'() {
      this.getDepartments({directorate: this.form.directorate_id})
    },
    'form.department_id'() {
      this.getUnits({department: this.form.department_id})
    },
    'form.unit_id'() {
      this.getSections({unit: this.form.unit_id})
    }
  },

  mounted() {
    this.getDivisions()
    this.getDirectorates()
    if(this.activity) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.activity ? this.update() : this.add()
    },

    add() {
      this.form.post('/activities').then((response) => {
        this.$toast.success('New activity added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/activities/${this.activity.id}`).then((response) => {
        this.$toast.success('Activity updated successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    done() {
      this.$emit('done')
    },

    getDivisions() {
      this.$axios.$get(`/divisions`).then((response) => {
        this.divisions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    getDirectorates() {
      this.$axios.$get(`/directorates`).then((response) => {
        this.directorates = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    getDepartments(filters = {}) {
      this.loadingDepartments = true
      this.$axios.$get(`/departments`, {
        params: {
          ...filters
        }
      }).then((response) => {
        this.departments = response.data
        this.loadingDepartments = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loadingDepartments = false
      })
    },

    getUnits(filters = {}) {
      this.loadingUnits = true
      this.$axios.$get(`/units`, {
        params: {
          ...filters
        }
      }).then((response) => {
        this.units = response.data
        this.loadingUnits = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loadingUnits = false
      })
    },

    getSections(filters = {}) {
      this.loadingSections = true
      this.$axios.$get(`/sections`, {
        params: {
          ...filters
        }
      }).then((response) => {
        this.sections = response.data
        this.loadingSections = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loadingSections = false
      })
    },

    populateForm() {
      forIn(this.activity, (value, key) => {
        if (this.isObject(this.activity[key])) {
          this.form[key] = this.activity[key].id
        }

        this.form[key] = this.activity[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
