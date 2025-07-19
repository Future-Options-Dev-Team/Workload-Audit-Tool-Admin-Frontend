export const state = () => ({
  all: [],
  roles: []
})

export const actions = {
  async fetchAll({ commit, rootState }) {
    const res = await this.$axios.$get('/users', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_ALL', res.data)
    commit('pagination/addPagination', res, { root: true })
  },

  async fetchRoles({ commit, rootState }) {
    const res = await this.$axios.$get('/roles', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_ROLES', res.data)
    commit('pagination/addPagination', res, { root: true })
  }
}

export const mutations = {
  ADD_ALL(state, users) {
    state.all = users
  },
  ADD_ROLES(state, roles) {
    state.roles = roles
  }
}