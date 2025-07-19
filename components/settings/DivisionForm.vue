<template>
  <div class="text-gray-500">
    <div class="text-lg text-gray-600 font-semibold mb-5 bg-gray-100 px-4 py-3 border-b">
      {{ formTitle }}
    </div>
    <div class="p-4">
      <v-text-field
        v-model="form.name"
        :error-messages="form.errors.get('name')"
        outlined
        dense
        light
        label="Division name"
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
  name: 'DivisionForm',

  props: {
    division: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      form: this.$form({
        name: '',
        description: ''
      })
    }
  },

  computed: {
    formTitle() {
      return this.division ? 'Update division' : 'Add new division'
    }
  },

  mounted() {
    if(this.division) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.division ? this.update() : this.add()
    },

    add() {
      this.form.post('/divisions', this.form).then((response) => {
        this.$toast.success('New division added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/divisions/${this.division.id}`).then((response) => {
        this.$toast.success('Division updated successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    done() {
      this.$emit('done')
    },

    populateForm() {
      forIn(this.division, (value, key) => {
        if (this.isObject(this.division[key])) {
          this.form[key] = this.division[key].id
        }

        this.form[key] = this.division[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
