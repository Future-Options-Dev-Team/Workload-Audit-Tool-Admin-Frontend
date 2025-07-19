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
        label="Task name"
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
  name: 'TaskForm',

  props: {
    task: {
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
        activity_id: this.$route.params.id,
        name: '',
        description: ''
      })
    }
  },

  computed: {
    formTitle() {
      return this.task ? 'Update task' : 'Add new task'
    }
  },

  mounted() {
    if(this.task) {
      this.populateForm()
    }
  },

  methods: {
    submit() {
      this.task ? this.update() : this.add()
    },

    add() {
      this.form.post('/tasks').then((response) => {
        this.$toast.success('New task added successfully!')
        this.$nuxt.refresh()
        this.done()
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },

    update() {
      this.form.patch(`/tasks/${this.task.id}`).then((response) => {
        this.$toast.success('Task updated successfully!')
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
      forIn(this.task, (value, key) => {
        if (this.isObject(this.task[key])) {
          this.form[key] = this.task[key].id
        }

        this.form[key] = this.task[key]
      })
    },

    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    }
  }
}
</script>
