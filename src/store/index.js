import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  storage: window.localStorage
})

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    companies: []
  },
  mutations: {
    changeCompanies(state, newCompanies) {
      state.companies = newCompanies
    }
  },
  actions: {
    addCompany({ state, commit }, company) {
      commit('changeCompanies', [...state.companies, company])
    },
    changeEditingStatus({ state, commit }, id) {
      commit(
        'changeCompanies',
        state.companies.map(company => {
          return company.id === id
            ? { ...company, editing: !company.editing }
            : company
        })
      )
    },
    changeCompanyInfo({ state, commit }, company) {
      commit(
        'changeCompanies',
        state.companies.map(c => {
          return company.id === c.id ? company : c
        })
      )
    },
    deleteCompany({ state, commit }, id) {
      commit(
        'changeCompanies',
        state.companies.filter(company => company.id !== id)
      )
    }
  },
  plugins: [vuexPersist.plugin]
})
