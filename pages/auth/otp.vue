<template>
  <div class="grid lg:grid-cols-6 lg:gap-4 sm:grid-cols-1 sm:gap-0 h-screen">
    <div class="col-start-3 col-span-2 bg-white p-2 shadow-lg lg:rounded overflow-hidden grid lg:grid-cols-1 sm:grid-cols-1 gap-0 lg:m-auto">
      <div class="p-8">
        <h1 class="text-2xl font-medium text-gray-600">
          Enter OTP to authenticate
        </h1>
        <span class="text-gray-400 text-sm block mt-2">
          We sent a verification code to your mobile. Enter the code from the mobile in the field below.
        </span>

        <div class="mt-8">
          <v-otp-input
            v-model="form.otp"
            :disabled="loading"
            @finish="validate"
          ></v-otp-input>

          <v-btn
            :loading="loading"
            class="mt-12"
            color="primary"
            dark
            depressed
            block
            @click="validate()"
          >
            Validate
          </v-btn>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtpPage',

  layout: 'auth',

  middleware({ app, redirect }) {
    if (app.$auth.loggedIn
      && app.$auth.user.settings.allow_two_factor_authentication
      && app.$auth.user.otp_verified
    ) {
      return redirect('/')
    }

    if (!app.$auth.loggedIn) {
      return redirect('/auth/login')
    }
  },

  data() {
    return {
      loading: false,
      form: {
        otp: ''
      }
    }
  },

  methods: {
    validate () {
      this.loading = true
      this.$axios.$post('/auth/validate-otp', this.form)
        .then((res) => {
          this.loading = false
          this.$toast.success('OTP Validated successfully!')
          location.reload()
        })
        .catch((error) => {
          this.$toast.error(error.message)
          this.loading = false
        })
    },

    resend () {
      this.loading = true
      this.$axios.$get('/auth/resend-otp')
        .then((res) => {
          this.loading = false
          this.$toast.success('OTP resent successfully!')
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
