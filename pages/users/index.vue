<template>
  <div>
    <base-breadcrumb :items="breadcrumbItems" />

    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Users
        </span>
        <p class="text-gray-400">A list of users of the tool</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newUserDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add user
        </v-btn>
      </div>
    </div>

    <!-- <tab-menu :items="items" /> -->

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="users"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <user-list-item v-for="user in users" :key="user.id" :user="user" />
    </div>

    <div class="mt-6">
      <base-pagination resource="User" @changePage="pageChangeHandler" />
    </div>

    <base-modal :open="newUserDialog" width="700px" @close="newUserDialog = false">
      <user-form @done="done" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseBreadcrumb from '~/components/ui/BaseBreadcrumb.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
// import TabMenu from '~/components/ui/TabMenu.vue'
import UserForm from '~/components/users/UserForm.vue'
import UserListItem from '~/components/users/UserListItem.vue'
export default {
  name: 'UsersPage',

  components: {
    BaseModal,
    BaseFilters,
    UserForm,
    BasePagination,
    UserListItem,
    // TabMenu,
    BaseBreadcrumb
  },

  data() {
    return {
      newUserDialog: false,
      loading: false,
      filters: {},
      items: [
        { name: 'Users', to: '/users', exact: true },
        { name: 'Roles', to: '/users/roles', exact: true },
      ],
      breadcrumbItems: [
        { label: 'Home', name: 'home', to: '/' },
        { label: 'Users', name: 'users', to: '/users' },
      ],
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('users/fetchAll')
  },

  computed: {
    ...mapState({ users: (state) => state.users.all })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('users/fetchAll')
      this.loading = false
      window.scrollTo(0, 0)
    },

    done() {
      this.close()
    }
  }
}
</script>

<style>

</style>