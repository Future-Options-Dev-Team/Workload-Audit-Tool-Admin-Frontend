import forIn from 'lodash/forIn'
export const state = () => ({
  all: {}
})

export const actions = {
  reset ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('clear')
      commit('pagination/changePage', 1, { root: true })
      resolve()
    })
  }
}

export const mutations = {
  addOne(state, filter) {
    const filterName = Object.keys(filter)[0]
    state.all[filterName] = filter[filterName]
  },
  addMany(state, filters) {
    forIn(filters, (value, key) => {
      state.all[key] = value
    })
  },
  clear(state) {
    state.all = {}
  }
}

export const getters = {
  list(state) {
    return state.all
  }
}
