export const state = () => ({
  workloads: []
})

export const actions = {
  async fetchWorkloads({ commit, rootState }) {
    const res = await this.$axios.$get('/predetermined-workloads', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_WORKLOADS', res.data)
    commit('pagination/addPagination', res, { root: true })
  }
}

export const mutations = {
  ADD_WORKLOADS(state, workloads) {
    state.workloads = workloads
  }
}