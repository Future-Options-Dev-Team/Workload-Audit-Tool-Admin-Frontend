export const state = () => ({
  directorate: '',
  department: '',
  unit: '',
  search: ''
})

export const mutations = {
  updateDirectorate(state, directorate) {
    state.directorate = directorate
  },
  updateDepartment(state, department) {
    state.department = department
  },
  updateUnit(state, unit) {
    state.unit = unit
  },
  updateSearch(state, search) {
    state.search = search
  }
}