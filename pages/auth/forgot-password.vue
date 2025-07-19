<template>
  <div class="flex items-center justify-center h-screen place-items-center">
    <div class="w-2/6 bg-white p-2 shadow-lg lg:rounded overflow-hidden">
      <div class="p-8">
        <h1 class="text-2xl font-bold text-primary">
          Password Recovery!
        </h1>
        <p class="text-gray-400">Please provide your email ad let us help you recover your password!</p>

        <div class="mt-8">
          <form @keyup.enter="login">
            <v-text-field
              v-model="form.email"
              label="Email"
              prepend-inner-icon="mdi-account"
              outlined
              clearable
              dense
            ></v-text-field>

            <div v-if="validatedEmail">
              <div class="mb-2 font-medium">Enter OTP</div>
              <v-otp-input
                v-model="form.otp"
                :disabled="loading"
                @finish="validateOtp"
              ></v-otp-input>
            </div>

            <div v-if="validatedOtp" class="mt-5 border rounded p-4">
              <div class="mb-5 font-medium">
                Set new password
              </div>
              <v-text-field
                v-model="form.password"
                :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_password ? 'text' : 'password'"
                label="New password"
                prepend-inner-icon="mdi-lock"
                outlined
                clearable
                dense
                @click:append="show_password = !show_password"
              ></v-text-field>

              <v-text-field
                v-model="form.confirm_password"
                :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_password ? 'text' : 'password'"
                label="Confirm new password"
                prepend-inner-icon="mdi-lock"
                outlined
                clearable
                dense
                @click:append="show_password = !show_password"
              ></v-text-field>
            </div>

            <v-btn
              v-if="!validatedEmail && !validatedOtp"
              :loading="loading"
              class="mt-5"
              color="primary"
              dark
              depressed
              block
              @click="validateEmail()"
            >
              Validate email
            </v-btn>

            <v-btn
              v-if="validatedEmail && !validatedOtp"
              :loading="loading"
              class="mt-5"
              color="primary"
              dark
              depressed
              block
              @click="validateOtp()"
            >
              Validate otp
            </v-btn>

            <v-btn
              v-if="validatedOtp"
              :loading="loading"
              class="mt-5"
              color="primary"
              dark
              depressed
              block
              @click="resetPassword()"
            >
              Reset password
            </v-btn>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',

  layout: 'auth',

  auth: false,

  data() {
    return {
      loading: false,
      show_password: false,
      validatedEmail: false,
      validatedOtp: false,
      form: {
        email: '',
        otp: '',
        password: '',
        confirm_password: ''
      }
    }
  },

  methods: {
    async validateEmail() {
      this.loading = true
      await this.$axios.post('auth/validate-email', this.form)
        .then(() => {
          this.$toast.success('Email validated! OTP has been sent to your email.')
          this.validatedEmail = true
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message)
        })
      
      this.loading = false
    },
    async validateOtp() {
      this.loading = true
      await this.$axios.post('auth/validate-reset-otp', this.form)
        .then(() => {
          this.$toast.success('You have successfully validated OTP!')
          this.validatedOtp = true
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message)
        })
      
      this.loading = false
    },
    async resetPassword() {
      this.loading = true
      await this.$axios.post('auth/reset-password', this.form)
        .then(() => {
          this.$toast.success('Password reset successfully! Please continue to login.')
          this.validatedOtp = false
          this.validatedEmail = false
          this.$router.push('/auth/login')
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message)
        })
      
      this.loading = false
    }
  }
}
</script>
