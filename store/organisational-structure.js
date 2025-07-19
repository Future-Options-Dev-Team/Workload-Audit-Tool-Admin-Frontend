export const state = () => ({
  divisions: [],
  directorates: [],
  departments: [],
  units: [],
  sections: [],
  positions: []
})

export const actions = {
  async fetchDivisions({ commit, rootState }) {
    const res = await this.$axios.$get('/divisions', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_DIVISIONS', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchDirectorates({ commit, rootState }) {
    const res = await this.$axios.$get('/directorates', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_DIRECTORATES', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchDepartments({ commit, rootState }) {
    const res = await this.$axios.$get('/departments', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_DEPARTMENTS', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchUnits({ commit, rootState }) {
    const res = await this.$axios.$get('/units', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_UNITS', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchSections({ commit, rootState }) {
    const res = await this.$axios.$get('/sections', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_SECTIONS', res.data)
    commit('pagination/addPagination', res, { root: true })
  },
  async fetchPositions({ commit, rootState }) {
    const res = await this.$axios.$get('/positions', {
      params: {
        page: rootState.pagination.all.current_page,
        per_page: rootState.pagination.all.per_page,
        ...rootState.filters.all
      }
    })

    commit('ADD_POSITIONS', res.data)
    commit('pagination/addPagination', res, { root: true })
  }
}

export const mutations = {
  ADD_DIVISIONS(state, divisions) {
    state.divisions = divisions
  },
  ADD_DIRECTORATES(state, directorates) {
    state.directorates = directorates
  },
  ADD_DEPARTMENTS(state, departments) {
    state.departments = departments
  },
  ADD_UNITS(state, units) {
    state.units = units
  },
  ADD_SECTIONS(state, sections) {
    state.sections = sections
  },
  ADD_POSITIONS(state, positions) {
    state.positions = positions
  }
}