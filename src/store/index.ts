import { createStore } from 'vuex'
import { formatCurrent, formatForecast } from '@/functions/formatter'
import { getData } from '@/functions/async'

export default createStore({
  state: {
    currentData: null,
    forecastedData: null,
    requestError: null,
    temp: 'c',
    wind: 'm',
    precip: 'in',
    moreCurrent: false,
    moreForecast: false
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
    },
    getTemp(state) {
      return state.temp
    },
    getWind(state) {
      return state.wind
    },
    getPrecip(state) {
      return state.precip
    },
    getMoreC(state) {
      return state.moreCurrent
    },
    getMoreF(state) {
      return state.moreForecast
    }
  },
  mutations: {
    updateCurrent(state, data) {
      state.currentData = data
    },
    updateError(state, error) {
      state.requestError = error
    },
    updateForecasted(state, data) {
      state.forecastedData = data
    },
    updateTemp(state, v: string) {
      state.temp = v
    },
    updateWind(state, v: string) {
      state.wind = v
    },
    updatePrecip(state, v: string) {
      state.precip = v
    },
    updateMoreC(state) {
      state.moreCurrent = !state.moreCurrent
    },
    updateMoreF(state) {
      state.moreForecast = !state.moreForecast
    },
    clearCurrent(state) {
      state.currentData = null
    },
    clearForecast(state) {
      state.forecastedData = null
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