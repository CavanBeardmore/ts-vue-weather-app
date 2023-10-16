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
      <button class="toggle-button" @click="toggle('on')" v-show="!showingAll">Show More Information For All</button>
      <button class="toggle-button" @click="toggle('off')" v-show="showingAll">Hide More Information For All</button>
      <button class="toggle-button" @click="toggle('four')" v-show="!fourHourly && showingType === 'forecast'">Show Four Hourly Data</button>
      <button class="toggle-button" @click="toggle('four')" v-show="fourHourly && showingType === 'forecast'">Hide Four Hourly Data</button>
      <button class="toggle-button" @click="toggle('astro')" v-show="!showAstro && showingType === 'forecast'">Show Astrological Data</button>
      <button class="toggle-button" @click="toggle('astro')" v-show="showAstro && showingType === 'forecast'">Hide Astrological Data</button>
    </div>
    <div>
      <div class="location-list" v-for="location in locationsList" :key="location.name">
        <ul class="location" v-if="location.weatherData.location && location.weatherData.current">
          <h2>{{location.name}}</h2>
          <button class="button" v-show="showingType === 'current'" @click="toggle('type', 'forecast')">Show 3 Day Forecast Data</button>
          <button class="button" v-show="showingType === 'forecast'" @click="toggle('type', 'current')">Show Current Data</button>
          <button class="button" @click="locationToggleMoreInfo(location)" v-show="!location.moreInfo">Show More Information</button>
          <button class="button" @click="locationToggleMoreInfo(location)" v-show="location.moreInfo">Hide More Information</button>
          <button class="button" @click="deleteLocation(location)">Delete Location</button>
          <p v-if="requestError" style="color: red">{{requestError}}</p>
          <table v-if="showingType === 'current'">
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
          <div v-if="showingType === 'forecast'">
            <div v-for="day in location.weatherData.forecast.forecastday" :key="day" class="forecast-day">
              <h4>{{day.date}}</h4>
              <table v-if="!fourHourly">
                <tr>
                  <th>Condition:</th>
                  <th>Maximum Temperature:</th>
                  <th>Chance Of Rain:</th>
                  <th v-if="showMore || location.moreInfo">Chance of Snow:</th>
                  <th v-if="showMore || location.moreInfo">Average Temperature:</th>
                  <th v-if="showMore || location.moreInfo">Minimum Temperature:</th>
                  <th v-if="showMore || location.moreInfo">Average Humidity:</th>
                  <th v-if="showMore || location.moreInfo">Maximum Wind Speed:</th>
                  <th v-if="showMore || location.moreInfo">Total Precipitation:</th>
                  <th v-if="showMore || location.moreInfo">Average Visibility:</th>
                  <th v-if="showMore || location.moreInfo">UV:</th>
                </tr>
                <tr>
                  <td><img :src="day.day.condition.icon"></td>
                  <td v-show="temperature === 'c'">{{day.day.maxtemp_c}} °C</td>
                  <td v-show="temperature === 'f'">{{day.day.maxtemp_f}} °F</td>
                  <td>{{day.day.daily_chance_of_rain}}%</td>
                  <td v-if="showMore || location.moreInfo">{{day.day.daily_chance_of_snow}}%</td>
                  <td v-if="showMore || location.moreInfo" v-show="temperature === 'c'">{{day.day.avgtemp_c}} °C</td>
                  <td v-if="showMore || location.moreInfo" v-show="temperature === 'f'">{{day.day.avgtemp_f}} °F</td>
                  <td v-if="showMore || location.moreInfo" v-show="temperature === 'c'">{{day.day.mintemp_c}} °C</td>
                  <td v-if="showMore || location.moreInfo" v-show="temperature === 'f'">{{day.day.mintemp_f}} °F</td>
                  <td v-if="showMore || location.moreInfo">{{day.day.avghumidity}}%</td>
                  <td v-if="showMore || location.moreInfo" v-show="wind === 'k'">{{day.day.maxwind_kph}} KPH</td>
                  <td v-if="showMore || location.moreInfo" v-show="wind === 'm'">{{day.day.maxwind_mph}} MPH</td>
                  <td v-if="showMore || location.moreInfo" v-show="precip === 'mm'">{{day.day.totalprecip_mm}} mm</td>
                  <td v-if="showMore || location.moreInfo" v-show="precip === 'in'">{{day.day.totalprecip_in}} inches</td>
                  <td v-if="showMore || location.moreInfo" v-show="wind === 'k'">{{day.day.avgvis_km}} km</td>
                  <td v-if="showMore || location.moreInfo" v-show="wind === 'm'">{{day.day.avgvis_miles}} miles</td>
                  <td v-if="showMore || location.moreInfo">{{day.day.uv}}</td>
                </tr>
              </table>
              <br v-if="astro">
              <table v-if="astro">
                <tr>
                  <th>Sunrise:</th>
                  <th>Sunset:</th>
                  <th>Moonrise:</th>
                  <th>Moonset:</th>
                  <th>Moon Phase:</th>
                  <th>Moon Illumination:</th>
                </tr>
                <tr>
                  <td>{{day.astro.sunrise}}</td>
                  <td>{{day.astro.sunset}}</td>
                  <td>{{day.astro.moonrise}}</td>
                  <td>{{day.astro.moonset}}</td>
                  <td>{{day.astro.moon_phase}}</td>
                  <td>{{day.astro.moon_illumination}}%</td>
                </tr>
              </table>
              <br v-if="showAstro">
              <table v-if="showAstro">
                <tr>
                  <th>Sunrise:</th>
                  <th>Sunset:</th>
                  <th>Moonrise:</th>
                  <th>Moonset:</th>
                  <th>Moon Phase:</th>
                  <th>Moon Illumination:</th>
                </tr>
                <tr>
                  <td>{{day.astro.sunrise}}</td>
                  <td>{{day.astro.sunset}}</td>
                  <td>{{day.astro.moonrise}}</td>
                  <td>{{day.astro.moonset}}</td>
                  <td>{{day.astro.moon_phase}}</td>
                  <td>{{day.astro.moon_illumination}}%</td>
                </tr>
              </table>
              <br v-if="showAstro">
              <div v-for="hour in day.hour" :key="hour">
                <table v-if="fourHourly" v-show="multipleOf4(hour.time.split(' ')[1])">
                  <tr>
                    <th>Time:</th>
                    <th>Condition:</th>
                    <th>Temperature:</th>
                    <th>Chance Of Rain:</th>
                    <th v-if="location.moreInfo">Chance Of Snow:</th>
                    <th v-if="location.moreInfo">Cloud Coverage:</th>
                    <th v-if="location.moreInfo">Feels Like:</th>
                    <th v-if="location.moreInfo">Humidity:</th>
                    <th v-if="location.moreInfo">Precipitation:</th>
                    <th v-if="location.moreInfo">UV:</th>
                    <th v-if="location.moreInfo">Visibility:</th>
                    <th v-if="location.moreInfo">Wind Speed:</th>
                    <th v-if="location.moreInfo">Wind Direction:</th>
                  </tr>
                  <tr>
                    <td>{{hour.time.split(' ')[1]}}</td>
                    <td><img :src="hour.condition.icon"></td>
                    <td>{{hour.temp_c}} °C</td>
                    <td>{{hour.chance_of_rain}}%</td>
                    <td v-if="location.moreInfo">{{hour.chance_of_snow}}%</td>
                    <td v-if="location.moreInfo">{{hour.cloud}}%</td>
                    <td v-if="location.moreInfo" v-show="temperature === 'c'">{{hour.feelslike_c}} °C</td>
                    <td v-if="location.moreInfo" v-show="temperature === 'f'">{{hour.feelslike_f}} °F</td>
                    <td v-if="location.moreInfo">{{hour.humidity}}%</td>
                    <td v-if="location.moreInfo" v-show="precip === 'in'">{{hour.precip_in}} inches</td>
                    <td v-if="location.moreInfo" v-show="precip === 'mm'">{{hour.precip_mm}} mm</td>
                    <td v-if="location.moreInfo">{{hour.uv}}</td>
                    <td v-if="location.moreInfo" v-show="wind === 'k'">{{hour.vis_km}} km</td>
                    <td v-if="location.moreInfo" v-show="wind === 'm'">{{hour.vis_miles}} miles</td>
                    <td v-if="location.moreInfo" v-show="wind === 'k'">{{hour.wind_kph}} KPH</td>
                    <td v-if="location.moreInfo" v-show="wind === 'm'">{{hour.wind_mph}} MPH</td>
                    <td v-if="location.moreInfo">{{hour.wind_dir}}</td>
                  </tr>
                </table>
                <br v-if="fourHourly" v-show="multipleOf4(hour.time.split(' ')[1])">
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
    <div class="error">
      <p v-if="!requestError && locationsList.length === 0">You have not yet added any locations.</p>
      <p v-if="requestError">{{requestError}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { useStore } from 'vuex'
import { computed, onMounted, ref, onUpdated } from 'vue'
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
    const showingAll: Ref<boolean> = ref(false);
    const fourHourly: Ref<boolean> = ref(false);
    const showAstro: Ref<boolean> = ref(false);

    //strings
    const showingType: Ref<string> = ref('current');
    
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

    onUpdated(() => {
      let areAllShowing: number = 0

      for (let i = 0; i < locationsList.value.length; i++) {
        if (locationsList.value[i].moreInfo === true) {
          areAllShowing++
        }
      }

      if (areAllShowing === locationsList.value.length) {
        showingAll.value = true
        areAllShowing = 0
      } else {
        showingAll.value = false
        areAllShowing = 0
      }
    })

    function toggle(m: string, v: string) {
      if (m === 'temp') {
        store.commit('updateTemp', v )
      } else if (m === 'wind') {
        store.commit('updateWind', v)
      } else if (m === 'precip') {
        store.commit('updatePrecip', v)
      } else if (m === 'type') {
        showingType.value = v
      } else if (m === 'on'){
        for (var i = 0; i < locationsList.value.length; i++) {
          if (locationsList.value[i].moreInfo === false) {
            locationsList.value[i].toggleMoreInfo()
            showingAll.value = true
          }
        }
      } else if (m === 'off'){
        for (var i = 0; i < locationsList.value.length; i++) {
          if (locationsList.value[i].moreInfo === true) {
            locationsList.value[i].toggleMoreInfo()
            showingAll.value = false
          }
        }
      } else if (m === 'four') {
        fourHourly.value = !fourHourly.value
      } else if (m === 'astro') {
        showAstro.value = !showAstro.value
      }
    }

    function locationToggleMoreInfo(location: Location) {
      location.toggleMoreInfo()
      showingMore.value = !showingMore.value
    } 

    function multipleOf4(hour: string){
      if (hour === '00:00'){
        return true
      } else if (hour === '04:00'){
        return true
      } else if (hour === '08:00'){
        return true
      } else if (hour === '12:00'){
        return true
      } else if (hour === '16:00'){
        return true
      } else if (hour === '20:00'){
        return true
      } else if (hour === '23:00'){
        return true
      } else {
        return false
      }
    }

    function deleteLocation(location: Location) {
      const index = locationsList.value.indexOf(location);
      store.dispatch('removeLocation', index);
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
      showingMore,
      showingType,
      showingAll,
      fourHourly,
      multipleOf4,
      showAstro,
      deleteLocation
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

.error {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
}
</style>