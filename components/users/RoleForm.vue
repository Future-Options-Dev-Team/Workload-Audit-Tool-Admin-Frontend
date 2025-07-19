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
  name: 'RoleForm',

  props: {
    role: {
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
        name: '',
        guard_name: 'api',
        permissions: []
      }),
      permissions: []
    }
  },

  computed: {
    formTitle() {
      return this.role ? 'Update role' : 'Add new role'
    },
    categories() {
      return groupBy(this.permissions, (permission) => permission.category)
    }
  },

  mounted() {
    this.fetchPermissions()
    if(this.role) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.role ? this.update() : this.add()
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
      this.form.post('/roles').then((response) => {
        this.$toast.success('New role added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      delete this.form.password
      this.form.patch(`/roles/${this.role.id}`).then((response) => {
        this.$toast.success('Role updated successfully!')
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
      forIn(this.role, (value, key) => {
        if (this.isObject(this.role[key])) {
          this.form[key] = this.role[key].id
        }

        if(key === 'permissions') {
          this.form[key] = this.role[key].map(permission => permission.name)
          return
        }

        this.form[key] = this.role[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
