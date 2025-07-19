<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          General settings
        </span>
        <p class="text-gray-400">General congirations of the tool</p>
      </div>
      <div class="ml-auto"></div>
    </div>

    <div class="mt-5">
      <div class="flex mt-10 border-t border-gray-300 pt-5">
        <div class="w-2/5 text-gray-600 text-lg font-medium">
          Company information
        </div>
        <div class="w-3/5 text-gray-600">
          <v-text-field
            v-model="form.name"
            label="Company name"
            outlined
            clearable
            dense
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            label="Email"
            outlined
            clearable
            dense
          ></v-text-field>

          <v-text-field
            v-model="form.phone"
            label="Phone"
            outlined
            clearable
            dense
          ></v-text-field>
        </div>
      </div>

      <div class="flex mt-10 border-t border-gray-300 pt-5">
        <div class="w-2/5 text-gray-600 text-lg font-medium">
          Operations
        </div>
        <div class="w-3/5 text-gray-600">
          <v-switch
            v-model="form.allow_two_factor_authentication"
            label="Allow two factor authentication"
            color="primary"
            hide-details
          ></v-switch>

          <v-text-field
            v-model="form.session_timeout_in_minutes"
            label="Session timeout in minutes"
            outlined
            clearable
            dense
            class="mt-5"
          ></v-text-field>

          <v-text-field
            v-model="form.password_expiry_in_days"
            label="Password expiry in days"
            outlined
            clearable
            dense
          ></v-text-field>
        </div>
      </div>
      <div class="mt-5 py-5 border-t border-gray-300 flex">
        <div class="ml-auto">
          <v-btn
            :loading="form.submitting"
            depressed
            color="primary"
            class="ml-auto"
            @click="submit"
          >
            Save changes
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import forIn from 'lodash/forIn'
export default {
  name: 'GeneralSettings',

  async asyncData({ $axios }) {
    const settings = await $axios.$get('settings')

    return {
      settings: settings.data
    }
  },

  data() {
    return {
      form: this.$form({
        name: '',
        email: '',
        phone: '',
        address: '',
        password_expiry_in_days: '',
        session_timeout_in_minutes: '',
        allow_two_factor_authentication: false
      }),
      otp_activated: false
    }
  },

  computed: {
    isUpdate() {
      return this.settings !== null
    }
  },

  mounted() {
    this.populateForm()
  },

  methods: {
    submit() {
      this.isUpdate ? this.update() : this.add()
    },
    add() {
      this.form.post('/settings')
        .then((res) => {
          this.$toast.success('Setings updated successfully!')
          location.reload()
        })
        .catch((error) => this.$toast.error(error.message))
    },
    update() {
      if(this.form.allow_two_factor_authentication) {
        this.otp_activated = true
      }
      this.form.patch(`/settings/${this.settings.id}`)
        .then((res) => {
          this.$toast.success('Setings updated successfully!')
          if(this.otp_activated) {
            this.$auth.logout()
          } else {
            this.$nuxt.refresh()
          }

        })
        .catch((error) => this.$toast.error(error.message))
    },

    populateForm() {
      forIn(this.settings, (value, key) => {
        if (this.isObject(this.settings[key])) {
          this.form[key] = this.settings[key].id
          return
        }

        this.form[key] = this.settings[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
