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

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Department name"
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
  name: 'DepartmentForm',

  props: {
    department: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: this.$form({
        division_id: '',
        directorate_id: '',
        name: '',
        description: ''
      }),
      divisions: [],
      directorates: []
    }
  },

  computed: {
    formTitle() {
      return this.department ? 'Update department' : 'Add new department'
    }
  },

  mounted() {
    this.getDivisions()
    this.getDirectorates()
    if(this.department) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.department ? this.update() : this.add()
    },

    add() {
      this.form.post('/departments').then((response) => {
        this.$toast.success('New department added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/departments/${this.department.id}`).then((response) => {
        this.$toast.success('Department updated successfully!')
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

    populateForm() {
      forIn(this.department, (value, key) => {
        if (this.isObject(this.department[key])) {
          this.form[key] = this.department[key].id
        }

        this.form[key] = this.department[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
