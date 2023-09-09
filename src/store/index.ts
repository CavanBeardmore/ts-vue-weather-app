import { createStore } from 'vuex'
import { formatCurrent, formatForecast } from '@/functions/formatter'
import { getData } from '@/functions/async'

export default createStore({
  state: {
    currentData: null,
    forecastedData: null,
    requestError: null
  },
  getters: {
    getCWData(state) {
      return state.currentData
    },
    getFWData(state) {
      return state.forecastedData
    },
    getError(state) {
      return state.requestError
    }
  },
  mutations: {
    updateCurrent(state, data) {
      state.currentData = data
      console.log(data)
    },
    updateError(state, error) {
      state.requestError = error
      console.log(error)
    },
    updateForecasted(state, data) {
      state.forecastedData = data
      console.log(data)
    }
  },
  actions: {
    getCurrentData({ commit }, payload) {

      const location: string  = payload

      getData(formatCurrent(
        'https://api.weatherapi.com/v1/current.json?key=930a60d791f84d648ee164103231807&q=',
        location,
        '&aqi=no'
      )).then(data => {
        commit('updateCurrent', data);
      }).catch(error => {
        commit('updateError', error);
      })

    },
    getForecastedData({ commit }, payload) {

      const location: string  = payload.location
      const days: number = payload.days

      console.log(location, days)

      getData(formatForecast(
        'https://api.weatherapi.com/v1/forecast.json?key=930a60d791f84d648ee164103231807&q=',
        location,
        '&days=',
        days,
        '&aqi=no&alerts=no'
      )).then(data => {
        commit('updateForecasted', data);
      }).catch(error => {
        commit('updateError', error);
      })

    }
  },
  modules: {
  }
})