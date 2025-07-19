<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Roles
        </span>
        <p class="text-gray-400">A list of roles</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newRoleDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add role
        </v-btn>
      </div>
    </div>

    <tab-menu :items="items" />

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="roles"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <role-list-item v-for="role in roles" :key="role.id" :role="role" />
    </div>

    <div v-if="roles.length" class="mt-6">
      <base-pagination resource="Roles" @changePage="pageChangeHandler" />
    </div>

    <base-modal :open="newRoleDialog" width="700px" @close="newRoleDialog = false">
      <role-form @done="newRoleDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import TabMenu from '~/components/ui/TabMenu.vue'
import RoleForm from '~/components/users/RoleForm.vue'
import RoleListItem from '~/components/users/RoleListItem.vue'
export default {
  name: 'RolesPage',

  components: { BaseModal, BaseFilters, RoleForm, BasePagination, RoleListItem, TabMenu },

  data() {
    return {
      newRoleDialog: false,
      loading: false,
      filters: {},
      items: [
        { name: 'Users', to: '/users', exact: true },
        { name: 'Roles', to: '/users/roles', exact: true },
      ],
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('users/fetchRoles')
  },

  computed: {
    ...mapState({ roles: (state) => state.users.roles })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('users/fetchRoles')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style>

</style>