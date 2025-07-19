<template>
  <div>
    <base-breadcrumb :items="items" />
    
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Clients
        </span>
        <p class="text-gray-400">A list of clients of the tool</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="dialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add client
        </v-btn>
      </div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="clients"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div v-if="clients.length">
      <div class="mt-5">
        <client-list-item v-for="client in clients" :key="client.id" :client="client" />
      </div>

      <div class="mt-6">
        <base-pagination resource="Clients" @changePage="pageChangeHandler" />
      </div>
    </div>

    <div v-else class="text-2xl font-bold text-gray-400 mt-5">
      No Clients Found!
    </div>

    <base-modal :open="dialog" width="500px" @close="dialog = false">
      <client-form @done="done" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseBreadcrumb from '~/components/ui/BaseBreadcrumb.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import ClientForm from '~/components/clients/ClientForm.vue'
import ClientListItem from '~/components/clients/ClientListItem.vue'
export default {
  name: 'ClientsPage',

  components: {
    BaseModal,
    BaseFilters,
    ClientForm,
    BasePagination,
    ClientListItem,
    BaseBreadcrumb
  },

  data() {
    return {
      dialog: false,
      loading: false,
      filters: {},
      items: [
        { label: 'Home', name: 'home', to: '/' },
        { label: 'Clients', name: 'clients', to: '/clients' },
      ],
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('clients/fetchAll')
  },

  computed: {
    ...mapState({ clients: (state) => state.clients.all })
  },

  methods: {
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('clients/fetchAll')
      this.loading = false
      window.scrollTo(0, 0)
    },

    done() {
      this.dialog = false
      this.$nuxt.refresh()
    }
  }
}
</script>

<style>

</style>