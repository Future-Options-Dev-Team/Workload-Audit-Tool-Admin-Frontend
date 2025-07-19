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

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Unit name"
      ></v-text-field>

      <v-text-field
        v-model="form.description"
        :error-messages="form.errors.get('description')"
        outlined
        dense
        light
        label="Description (Optional)"
      ></v-text-field>

      <v-switch
        v-model="form.is_regional"
        hide-details
        light
        label="Unit is regional"
        color="primary"
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
  name: 'UnitForm',

  props: {
    unit: {
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
        name: '',
        description: '',
        is_regional: false
      }),
      divisions: [],
      directorates: [],
      departments: []
    }
  },

  computed: {
    formTitle() {
      return this.unit ? 'Update unit' : 'Add new unit'
    }
  },

  mounted() {
    this.getDivisions()
    this.getDirectorates()
    this.getDepartments()
    if(this.unit) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.unit ? this.update() : this.add()
    },

    add() {
      this.form.post('/units').then((response) => {
        this.$toast.success('New unit added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/units/${this.unit.id}`).then((response) => {
        this.$toast.success('Unit updated successfully!')
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

    populateForm() {
      forIn(this.unit, (value, key) => {
        if (this.isObject(this.unit[key])) {
          this.form[key] = this.unit[key].id
        }

        this.form[key] = this.unit[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
