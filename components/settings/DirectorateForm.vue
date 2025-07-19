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

      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Directorate name"
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
  name: 'DirectorateForm',

  props: {
    directorate: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: this.$form({
        division_id: '',
        name: '',
        description: ''
      }),
      divisions: []
    }
  },

  computed: {
    formTitle() {
      return this.directorate ? 'Update directorate' : 'Add new directorate'
    }
  },

  mounted() {
    this.getDivisions()
    if(this.directorate) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.directorate ? this.update() : this.add()
    },

    add() {
      this.form.post('/directorates').then((response) => {
        this.$toast.success('New directorate added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
        this.done()
      })
    },

    update() {
      this.form.patch(`/directorates/${this.directorate.id}`).then((response) => {
        this.$toast.success('Directorate updated successfully!')
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

    getDivisions() {
      this.$axios.$get(`/divisions`).then((response) => {
        this.divisions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    populateForm() {
      forIn(this.directorate, (value, key) => {
        if (this.isObject(this.directorate[key])) {
          this.form[key] = this.directorate[key].id
        }

        this.form[key] = this.directorate[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
