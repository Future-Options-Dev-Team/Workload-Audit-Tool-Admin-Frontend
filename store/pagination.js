export const state = () => ({
  all: {
    current_page: 1,
    per_page: 8
  }
})

export const actions = {
  initialize({ commit }, pagination) {
    commit('addPagination', pagination)
  }
}

export const mutations = {
  addPagination(state, { meta, links }) {
    state.all = {
      ...meta,
      ...links
    }
  },
  resetPagination(state) {
    state.all = {
      current_page: 1,
      per_page: 8
    }
  },
  setPerPage(state, perPage) {
    state.all.per_page = perPage
  },
  setPage(state, page) {
    state.all.current_page = page
  },
  changePage(state, pageNumber) {
    state.all.current_page = pageNumber
  },
  nextPage(state) {
    state.all.current_page = state.all.current_page + 1
  },
  prevPage(state) {
    state.all.current_page = state.all.current_page - 1
  }
}
