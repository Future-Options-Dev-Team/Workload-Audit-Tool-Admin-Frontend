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
        dense
        outlined
        light
        label="Section"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Position name"
      ></v-text-field>

      <v-textarea
        v-model="form.description"
        :error-messages="form.errors.get('description')"
        outlined
        dense
        light
        rows="5"
        label="Description"
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
  name: 'PositionForm',

  props: {
    position: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: this.$form({
        division_id: '',
        directorate_id: '',
        department_id: '',
        unit_id: '',
        section_id: '',
        name: '',
        description: ''
      }),
      divisions: [],
      directorates: [],
      departments: [],
      units: [],
      sections: []
    }
  },

  computed: {
    formTitle() {
      return this.position ? 'Update position' : 'Add new position'
    }
  },

  mounted() {
    this.getDivisions()
    this.getDirectorates()
    this.getDepartments()
    this.getUnits()
    this.getSections()
    if(this.position) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.position ? this.update() : this.add()
    },

    add() {
      this.form.post('/positions').then((response) => {
        this.$toast.success('New section added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/positions/${this.position.id}`).then((response) => {
        this.$toast.success('Position updated successfully!')
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

    getDepartments() {
      this.$axios.$get(`/departments`).then((response) => {
        this.departments = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    getUnits() {
      this.$axios.$get(`/units`).then((response) => {
        this.units = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    getSections() {
      this.$axios.$get(`/sections`).then((response) => {
        this.sections = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    populateForm() {
      forIn(this.position, (value, key) => {
        if (this.isObject(this.position[key])) {
          this.form[key] = this.position[key].id
        }

        this.form[key] = this.position[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
