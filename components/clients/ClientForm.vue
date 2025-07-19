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

      <v-text-field
        v-model="form.address"
        :error-messages="form.errors.get('address')"
        outlined
        dense
        light
        label="Physical address"
      ></v-text-field>

      <v-text-field
        v-model="form.contact_person"
        :error-messages="form.errors.get('contact_person')"
        outlined
        dense
        light
        label="Contact person"
      ></v-text-field>

      <v-text-field
        v-model="form.contact_person_phone"
        :error-messages="form.errors.get('contact_person_phone')"
        outlined
        dense
        light
        label="Contact person phone number"
      ></v-text-field>

      <div v-if="!client" class="p-3 border rounded">
        <div class="mb-4 text-gray-500 font-semibold">Create default user</div>
        <v-text-field
          v-model="form.user_name"
          :error-messages="form.errors.get('user_name')"
          outlined
          dense
          light
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="form.user_email"
          :error-messages="form.errors.get('user_email')"
          outlined
          dense
          light
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="form.username"
          :error-messages="form.errors.get('username')"
          outlined
          dense
          light
          label="Username"
        ></v-text-field>

        <v-text-field
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
  name: 'ClientForm',

  props: {
    client: {
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
        contact_person: '',
        contact_person_phone: '',
        user_name: '',
        user_email: '',
        username: '',
        password: ''
      }),
      roles: [],
      permissions: []
    }
  },

  computed: {
    formTitle() {
      return this.client ? 'Update client' : 'Add new client'
    },
    categories() {
      return groupBy(this.permissions, (permission) => permission.category)
    }
  },

  mounted() {
    if(this.client) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.client ? this.update() : this.add()
    },

    add() {
      this.form.post('/clients').then((response) => {
        this.$toast.success('New client added successfully!')
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      delete this.form.password
      this.form.patch(`/clients/${this.client.id}`).then((response) => {
        this.$toast.success('Client updated successfully!')
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    done() {
      this.$emit('done')
    },

    populateForm() {
      forIn(this.client, (value, key) => {
        if (this.isObject(this.client[key])) {
          this.form[key] = this.client[key].id
        }

        this.form[key] = this.client[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
