<template>
  <div class="wrapper">
    <h1 class="locations-title">Locations</h1>
    <div class="location-controls"> 
      <button @click="toggle('temp', 'f')" v-show="temperature === 'c'" class="toggle-button"> Show in Fahrenheit </button>
      <button @click="toggle('temp', 'c')" v-show="temperature === 'f'" class="toggle-button"> Show in Celsius </button>
      <button @click="toggle('wind', 'k')" v-show="wind === 'm' && showingMore" class="toggle-button"> Show in Kilometers </button>
      <button @click="toggle('wind', 'm')" v-show="wind === 'k' && showingMore" class="toggle-button"> Show in Miles </button>
      <button @click="toggle('precip', 'mm')" v-show="precip === 'in' && showingMore" class="toggle-button"> Show in Millimeters </button>
      <button @click="toggle('precip', 'in')" v-show="precip === 'mm' && showingMore" class="toggle-button"> Show in Inches </button>
      <button class="toggle-button" @click="toggle">Show More Information For All</button>
    </div>
    <div>
      <div class="location-list" v-for="location in locationsList" :key="location.name">
        <ul class="location" v-if="location.weatherData.location && location.weatherData.current">
          <h2>{{location.name}}</h2>
          <button class="button">Get 3 Day Forecast</button>
          <button class="button" @click="locationToggleMoreInfo(location)" v-show="!location.moreInfo">Show More Information</button>
          <button class="button" @click="locationToggleMoreInfo(location)" v-show="location.moreInfo">Hide More Information</button>
          <p v-if="requestError" style="color: red">{{requestError}}</p>
          <table>
            <tr>
              <th>Time:</th>
              <th>Condition:</th>
              <th>Temp:</th>
              <th v-show="showMore  || location.moreInfo">Wind Speed:</th>
              <th v-show="showMore || location.moreInfo">Wind Direction:</th>
              <th v-show="showMore || location.moreInfo">Humidity:</th>
              <th v-show="showMore || location.moreInfo">Precipitation:</th>
              <th v-show="showMore || location.moreInfo">Cloud Coverage:</th>
              <th v-show="showMore || location.moreInfo">UV:</th>
              <th v-show="showMore || location.moreInfo">Feels Like:</th>
              <th v-show="showMore || location.moreInfo">Visibility:</th>
            </tr>
            <tr>
              <td>{{location.weatherData.location.localtime.split(' ')[1]}}</td> 
              <td><img :src="location.weatherData.current.condition.icon"></td> 
              <td v-show="temperature === 'c'">{{location.weatherData.current.temp_c}} °C</td>
              <td v-show="temperature === 'f'">{{location.weatherData.current.temp_f}} °F</td>
              <td v-if="showMore || location.moreInfo" v-show="wind === 'm'">{{location.weatherData.current.wind_mph}} MPH</td>
              <td v-if="showMore || location.moreInfo" v-show="wind === 'k'">{{location.weatherData.current.wind_kph}} KPH</td>
              <td v-if="showMore || location.moreInfo">{{location.weatherData.current.wind_dir}}</td>
              <td v-if="showMore || location.moreInfo">{{location.weatherData.current.humidity}}%</td>
              <td v-if="showMore || location.moreInfo" v-show="precip === 'in'">{{location.weatherData.current.precip_in}} inches</td>
              <td v-if="showMore || location.moreInfo" v-show="precip === 'mm'">{{location.weatherData.current.precip_mm}} mm</td>
              <td v-if="showMore || location.moreInfo">{{location.weatherData.current.cloud}}%</td>
              <td v-if="showMore || location.moreInfo">{{location.weatherData.current.uv}}</td>
              <td v-if="showMore || location.moreInfo" v-show="temperature === 'c'" class="feels-like">{{location.weatherData.current.feelslike_c}} °C</td>
              <td v-if="showMore || location.moreInfo" v-show="temperature === 'f'" class="feels-like">{{location.weatherData.current.feelslike_f}} °F</td>
              <td v-if="showMore || location.moreInfo" v-show="wind === 'm'">{{location.weatherData.current.vis_miles}} miles</td>
              <td v-if="showMore || location.moreInfo" v-show="wind === 'k'">{{location.weatherData.current.vis_km}} KM</td>
            </tr>
          </table>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { getData } from '../functions/async'
import { Location } from '../classes/locationClass'
import type { Ref } from 'vue'

export default {
  setup() {

    //use store
    const store = useStore();

    //boolean
    const showMore: Ref<boolean> = ref(false);
    const showingMore: Ref<boolean> = ref(false);
    
    //computed
    const locationsList = computed<[Location]>(() => store.getters.getLocations)
    const temperature = computed<string>(() => store.getters.getTemp)
    const wind = computed<string>(() => store.getters.getWind)
    const precip = computed<string>(() => store.getters.getPrecip)

    //errors
    const requestError: Ref<string> = ref('');

    onMounted(() => {
      for (let i = 0; i < locationsList.value.length; i++) {
        getData(locationsList.value[i].formatForecast(
        locationsList.value[i].forecastURLOne,
        locationsList.value[i].name,
        locationsList.value[i].forecastURLTwo,
        3,
        locationsList.value[i].forecastURLThree))
        .then((data) => {
          locationsList.value[i].addData(data)
        })
        .catch((err) => {
          requestError.value = err
        })
      }
    })

    function toggle(m: string, v: string) {
      if (m === 'temp') {
        store.commit('updateTemp', v )
      } else if (m === 'wind') {
        store.commit('updateWind', v)
      } else if (m === 'precip') {
        store.commit('updatePrecip', v)
      } else {
        showMore.value = !showMore.value
        showingMore.value = !showingMore.value
      }
    }

    function locationToggleMoreInfo(location: Location) {
      location.toggleMoreInfo()
      showingMore.value = !showingMore.value
    } 

    return {
      locationsList,
      requestError,
      temperature,
      wind,
      precip,
      toggle,
      showMore,
      locationToggleMoreInfo,
      showingMore
    }
  }
}
</script>

<style>

.locations-title {
  text-align: center;
}

.location-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;
  margin-right: 25px;
}

.location {
  background-color: #DEDFE2 ;
  padding: 20px;
  border-radius: 10px;
  padding: 30px;
  border-style: ridge;
  box-shadow: 4px 4px #AEABAB;
}

.location-controls {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  text-align: center;
  background-color: lightblue;
  border-radius: 10px;
  margin: 0 auto;
  width: fit-content;
  padding: 10px;
  border-style: ridge;
  box-shadow: 4px 4px #AEABAB;
}
</style>