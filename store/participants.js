export const state = () => ({
  all: []
})

export const actions = {
  async fetchAll({ commit, rootState }) {
    const res = await this.$axios.$get('/employees', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_ALL', res.data)
    commit('pagination/addPagination', res, { root: true })
  }
}

export const mutations = {
  ADD_ALL(state, employees) {
    state.all = employees
  }
}