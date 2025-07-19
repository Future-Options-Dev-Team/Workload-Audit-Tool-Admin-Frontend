<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Participants
        </span>
        <p class="text-gray-400">A list of participants</p>
      </div>
      <div class="ml-auto">
        <v-btn 
          depressed 
          color="primary"
          @click="newParticipantDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Add participant
        </v-btn>
      </div>
    </div>

    <base-filters
      :options="filters"
      :loading="loading"
      search-placeholder="participants"
      class="mt-3"
      @filterChanged="pageChangeHandler"
    ></base-filters>

    <div class="mt-5">
      <participant-list-item
        v-for="participant in participants"
        :key="participant.id"
        :participant="participant"
      />
    </div>

    <div v-if="participants.length" class="mt-6">
      <base-pagination resource="Participants" @changePage="pageChangeHandler" />
    </div>

    <div v-else class="text-gray-400 text-xl">
      No participants found!
    </div>
    
    <base-modal :open="newParticipantDialog" width="500px" @close="newParticipantDialog = false">
      <participant-form @done="newParticipantDialog = false" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ParticipantForm from '~/components/employees/ParticipantForm.vue'
import ParticipantListItem from '~/components/employees/ParticipantListItem.vue'
import BasePagination from '~/components/pagination/BasePagination.vue'
import BaseFilters from '~/components/ui/BaseFilters.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
export default {
  name: 'ParticipantsPage',

  components: { BaseFilters, BaseModal, ParticipantForm, BasePagination, ParticipantListItem },

  data() {
    return {
      loading: false,
      newParticipantDialog: false,
      filters: {}
    }
  },

  async fetch({ store }) {
    await store.dispatch('filters/reset')
    await store.dispatch('participants/fetchAll')
  },

  computed: {
    ...mapState({ participants: (state) => state.participants.all })
  },

  methods: {
    close() {
      this.dialog = false
    },
    async pageChangeHandler() {
      this.loading = true
      await this.$store.dispatch('participants/fetchAll')
      this.loading = false
      window.scrollTo(0, 0)
    }
  }
}
</script>
