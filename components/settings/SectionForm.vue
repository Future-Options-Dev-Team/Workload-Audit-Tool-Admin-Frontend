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

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Section name"
      ></v-text-field>

      <v-text-field
        v-model="form.description"
        :error-messages="form.errors.get('description')"
        outlined
        dense
        light
        label="Description (Optional)"
      ></v-text-field>

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
  name: 'SectionForm',

  props: {
    section: {
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
        name: '',
        description: ''
      }),
      divisions: [],
      directorates: [],
      departments: [],
      units: []
    }
  },

  computed: {
    formTitle() {
      return this.section ? 'Update section' : 'Add new section'
    }
  },

  mounted() {
    this.getDivisions()
    this.getDirectorates()
    this.getDepartments()
    this.getUnits()
    if(this.section) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.section ? this.update() : this.add()
    },

    add() {
      this.form.post('/sections').then((response) => {
        this.$toast.success('New section added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/sections/${this.section.id}`).then((response) => {
        this.$toast.success('Section updated successfully!')
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

    populateForm() {
      forIn(this.section, (value, key) => {
        if (this.isObject(this.section[key])) {
          this.form[key] = this.section[key].id
        }

        this.form[key] = this.section[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
