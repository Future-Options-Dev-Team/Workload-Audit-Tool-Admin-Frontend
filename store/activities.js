export const state = () => ({
  all: [],
  tasks: []
})

export const actions = {
  async fetchAll({ commit, rootState }, filters = {}) {
    const res = await this.$axios.$get('/activities', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all,
        ...filters,
      },
    })

    commit('ADD_ALL', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchTasks({ commit, rootState }, id) {
    const res = await this.$axios.$get(`/activities/${id}/tasks`, {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_TASKS', res.data)
    commit('pagination/addPagination', res, { root: true })
  },

  resetActivities({ commit }) {
    commit('RESET_ACTIVITIES', [])
  }
}

export const mutations = {
  ADD_ALL(state, activities) {
    state.all = activities
  },
  RESET_ACTIVITIES(state, activities) {
    state.all = activities
  },
  ADD_TASKS(state, tasks) {
    state.tasks = tasks
  },
}