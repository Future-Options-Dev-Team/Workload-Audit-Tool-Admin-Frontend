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
        label="Name of participant"
      ></v-text-field>

      <v-text-field
        v-model="form.phone"
        :error-messages="form.errors.get('phone')"
        outlined
        dense
        light
        label="Phone"
      ></v-text-field>

      <v-text-field
        v-model="form.email"
        :error-messages="form.errors.get('email')"
        outlined
        dense
        light
        label="Email"
      ></v-text-field>
      
      <v-text-field
        v-model="form.location"
        :error-messages="form.errors.get('location')"
        outlined
        dense
        light
        label="Location"
      ></v-text-field>

      <v-autocomplete
        v-model="form.position_id"
        :error-messages="form.errors.get('position_id')"
        :items="positions"
        dense
        outlined
        light
        label="Position"
        item-text="name"
        item-value="id"
      ></v-autocomplete>

      <v-text-field
        v-model="form.supervisor_name"
        :error-messages="form.errors.get('supervisor_name')"
        outlined
        dense
        light
        label="Supervisor name"
      ></v-text-field>

      <v-text-field
        v-model="form.supervisor_title"
        :error-messages="form.errors.get('supervisor_title')"
        outlined
        dense
        light
        label="Supervisor title"
      ></v-text-field>
      <v-menu
        v-model="dateDialog"
        :close-on-content-click="true"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="form.date"
            :error-messages="form.errors.get('date')"
            outlined
            light
            readonly
            dense
            label="Date"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="form.date"
          no-title
          @input="dateDialog = false"
        ></v-date-picker>
      </v-menu>

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
  name: 'ParticipantForm',

  props: {
    participant: {
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
      form: this.$form({
        position_id: '',
        name: '',
        phone: '',
        email: '',
        location: '',
        position: '',
        supervisor_name: '',
        supervisor_title: '',
        date: ''
      }),
      positions: []
    }
  },

  computed: {
    formTitle() {
      return this.participant ? 'Update participant' : 'Add new participant'
    }
  },

  mounted() {
    this.getPositions()
    if(this.participant) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.participant ? this.update() : this.add()
    },

    add() {
      this.form.post('/employees').then((response) => {
        this.$toast.success('New participant added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/employees/${this.participant.id}`).then((response) => {
        this.$toast.success('Participant updated successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    done() {
      this.$emit('done')
    },

    getPositions() {
      this.$axios.$get(`/positions`).then((response) => {
        this.positions = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    populateForm() {
      forIn(this.participant, (value, key) => {
        if (this.isObject(this.participant[key])) {
          this.form[key] = this.participant[key].id
        }

        this.form[key] = this.participant[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
