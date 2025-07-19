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
        label="Name"
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

      <v-autocomplete
        v-model="form.role_id"
        :items="roles"
        :error-messages="form.errors.get('role_id')"
        item-text="name"
        item-value="id"
        label="Role"
        outlined
        dense
        light
      ></v-autocomplete>

      <v-text-field
        v-model="form.username"
        :error-messages="form.errors.get('username')"
        outlined
        dense
        light
        label="Username"
      ></v-text-field>

      <v-text-field
        v-if="!user"
        v-model="form.password"
        :error-messages="form.errors.get('password')"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        outlined
        light
        dense
        @click:append="showPassword = !showPassword"
      ></v-text-field>
      
      <div class="mt-3">
        <div class="text-lg text-gray-600 py-3 border-b font-semibold">Permissions</div>

        <div class="text-center">
          <v-progress-circular
            v-if="loading"
            :width="2"
            indeterminate
            color="red"
            class="mt-5"
          ></v-progress-circular>
        </div>

        <div v-for="(permisions, category) in categories" :key="category" class="mt-5 px-3">
          <div class="text-gray-500 font-semibold capitalize">{{ category }}</div>

          <div class="grid grid-cols-3 gap-0 mt-1">
            <div v-for="permission in permisions" :key="permission.name" class="cursor-pointer capitalize">
              <v-checkbox
                v-model="form.permissions"
                :label="permission.name"
                :value="permission.name"
                light
              ></v-checkbox>
            </div>
          </div>
        </div>
      </div>

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
import groupBy from 'lodash/groupBy'
export default {
  name: 'UserForm',

  props: {
    user: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      startDateMenu: false,
      deadlineMenu: false,
      showPassword: false,
      dateDialog: false,
      form: this.$form({
        role_id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        username: '',
        password: '',
        permissions: []
      }),
      roles: [],
      permissions: []
    }
  },

  computed: {
    formTitle() {
      return this.user ? 'Update user' : 'Add new user'
    },
    categories() {
      return groupBy(this.permissions, (permission) => permission.category)
    }
  },

  mounted() {
    this.fetchRoles()
    this.fetchPermissions()
    if(this.user) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.user ? this.update() : this.add()
    },

    fetchRoles() {
      this.$axios.$get('roles').then((response) => {
        this.roles = response.data
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    },

    fetchPermissions() {
      this.loading = true
      this.$axios.$get('permissions').then((response) => {
        this.permissions = response.data
        this.loading = false
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
        this.loading = false
      })
    },

    add() {
      this.form.post('/users').then((response) => {
        this.$toast.success('New user added successfully!')
        location.reload()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      delete this.form.password
      this.form.patch(`/users/${this.user.id}`).then((response) => {
        this.$toast.success('User updated successfully!')
        location.reload()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    done() {
      this.$emit('done')
    },

    populateForm() {
      forIn(this.user, (value, key) => {
        if (this.isObject(this.user[key])) {
          this.form[key] = this.user[key].id
        }

        if(key === 'permissions') {
          this.form[key] = this.user[key].map(permission => permission.name)
          return
        }

        this.form[key] = this.user[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
