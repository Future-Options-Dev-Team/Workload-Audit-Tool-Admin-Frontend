<template>
  <div class="flex items-center justify-center h-screen place-items-center">
    <div class="w-2/6 bg-white p-2 shadow-lg lg:rounded overflow-hidden">
      <div class="p-8">
        <h1 class="text-2xl font-bold text-primary">
          Welcome back!
        </h1>
        <p class="text-gray-400">Please log into your account</p>

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

            <v-text-field
              v-model="form.password"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock"
              outlined
              clearable
              dense
              @click:append="show_password = !show_password"
            ></v-text-field>

            <div class="flex">
              <nuxt-link to="/auth/forgot-password" class="ml-auto">
                Forgot password?
              </nuxt-link>
            </div>

            <v-btn
              :loading="loading"
              class="mt-5"
              color="primary"
              dark
              depressed
              block
              @click="login()"
            >
              Sign in now
            </v-btn>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',

  layout: 'auth',

  data() {
    return {
      loading: false,
      show_password: false,
      form: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    async login() {
      this.loading = true
      await this.$auth.loginWith('local', { data: this.form })
        .then(() => {
          this.$toast.success('You have logged in successfully!')
          this.$router.replace('/')
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message)
        })
      
      this.loading = false
    }
  }
}
</script>
