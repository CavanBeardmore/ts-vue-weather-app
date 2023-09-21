<template>
      <div class="forecast" v-if="forecastedData">
      <h2>Forecasted Weather:</h2>
      <h3>{{forecastedData.location.name}}</h3>
      <div class="forecast-controls">
        <button @click="toggleMoreForecast" class="button">Show More Information</button> 
        <button @click="toggle4Hourly" class="button">Show Four Hourly Data</button>
        <button @click="clearForecast" class="button">Clear</button>
      </div>
      <div v-for="day in forecastedData.forecast.forecastday" :key="day" class="forecast-day">
        <h4>{{day.date}}</h4>
        <table v-if="!fourHourly">
          <tr>
            <th>Condition:</th>
            <th>Maximum Temperature:</th>
            <th>Chance Of Rain:</th>
            <th v-if="moreForecast">Chance of Snow:</th>
            <th v-if="moreForecast">Average Temperature:</th>
            <th v-if="moreForecast">Minimum Temperature:</th>
            <th v-if="moreForecast">Average Humidity:</th>
            <th v-if="moreForecast">Maximum Wind Speed:</th>
            <th v-if="moreForecast">Total Precipitation:</th>
            <th v-if="moreForecast">Average Visibility:</th>
            <th v-if="moreForecast">UV:</th>
          </tr>
          <tr>
            <td><img :src="day.day.condition.icon"></td>
            <td v-show="temperature === 'c'">{{day.day.maxtemp_c}} °C</td>
            <td v-show="temperature === 'f'">{{day.day.maxtemp_f}} °F</td>
            <td>{{day.day.daily_chance_of_rain}}%</td>
            <td v-if="moreForecast">{{day.day.daily_chance_of_snow}}%</td>
            <td v-if="moreForecast" v-show="temperature === 'c'">{{day.day.avgtemp_c}} °C</td>
            <td v-if="moreForecast" v-show="temperature === 'f'">{{day.day.avgtemp_f}} °F</td>
            <td v-if="moreForecast" v-show="temperature === 'c'">{{day.day.mintemp_c}} °C</td>
            <td v-if="moreForecast" v-show="temperature === 'f'">{{day.day.mintemp_f}} °F</td>
            <td v-if="moreForecast">{{day.day.avghumidity}}%</td>
            <td v-if="moreForecast" v-show="wind === 'k'">{{day.day.maxwind_kph}} KPH</td>
            <td v-if="moreForecast" v-show="wind === 'm'">{{day.day.maxwind_mph}} MPH</td>
            <td v-if="moreForecast" v-show="precip === 'mm'">{{day.day.totalprecip_mm}} mm</td>
            <td v-if="moreForecast" v-show="precip === 'in'">{{day.day.totalprecip_in}} inches</td>
            <td v-if="moreForecast" v-show="wind === 'k'">{{day.day.avgvis_km}} km</td>
            <td v-if="moreForecast" v-show="wind === 'm'">{{day.day.avgvis_miles}} miles</td>
            <td v-if="moreForecast">{{day.day.uv}}</td>
          </tr>
        </table>
        <div v-for="hour in day.hour" :key="hour">
          <table v-if="fourHourly" v-show="multipleOf4(hour.time.split(' ')[1])">
            <tr>
              <th>Time:</th>
              <th>Condition:</th>
              <th>Temperature:</th>
              <th>Chance Of Rain:</th>
              <th v-if="moreForecast">Chance Of Snow:</th>
              <th v-if="moreForecast">Cloud Coverage:</th>
              <th v-if="moreForecast">Feels Like:</th>
              <th v-if="moreForecast">Humidity:</th>
              <th v-if="moreForecast">Precipitation:</th>
              <th v-if="moreForecast">UV:</th>
              <th v-if="moreForecast">Visibility:</th>
              <th v-if="moreForecast">Wind Speed:</th>
              <th v-if="moreForecast">Wind Direction:</th>
            </tr>
            <tr>
              <td>{{hour.time.split(' ')[1]}}</td>
              <td><img :src="hour.condition.icon"></td>
              <td>{{hour.temp_c}} °C</td>
              <td>{{hour.chance_of_rain}}%</td>
              <td v-if="moreForecast">{{hour.chance_of_snow}}%</td>
              <td v-if="moreForecast">{{hour.cloud}}%</td>
              <td v-if="moreForecast" v-show="temperature === 'c'">{{hour.feelslike_c}} °C</td>
              <td v-if="moreForecast" v-show="temperature === 'f'">{{hour.feelslike_f}} °F</td>
              <td v-if="moreForecast">{{hour.humidity}}%</td>
              <td v-if="moreForecast" v-show="precip === 'in'">{{hour.precip_in}} inches</td>
              <td v-if="moreForecast" v-show="precip === 'mm'">{{hour.precip_mm}} mm</td>
              <td v-if="moreForecast">{{hour.uv}}</td>
              <td v-if="moreForecast" v-show="wind === 'k'">{{hour.vis_km}} km</td>
              <td v-if="moreForecast" v-show="wind === 'm'">{{hour.vis_miles}} miles</td>
              <td v-if="moreForecast" v-show="wind === 'k'">{{hour.wind_kph}} KPH</td>
              <td v-if="moreForecast" v-show="wind === 'm'">{{hour.wind_mph}} MPH</td>
              <td v-if="moreForecast">{{hour.wind_dir}}</td>
            </tr>
          </table>
          <br v-if="fourHourly" v-show="multipleOf4(hour.time.split(' ')[1])">
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';

export default {
  setup() {

    const store = useStore()

    //data
    const forecastedData = computed<Object>(() => store.getters.getFWData);

    //measurement toggle
    const temperature = computed<string>(() => store.getters.getTemp);
    const wind = computed<string>(() => store.getters.getWind);
    const precip = computed<string>(() => store.getters.getPrecip);

    //booleans
    const moreForecast = computed<Object>(() => store.getters.getMoreF);
    const fourHourly: Ref<boolean> = ref(false);

    //
    /* FUNCTIONS */
    //

    function toggleMoreForecast() {
      store.commit('updateMoreF')
    }

    function toggle4Hourly() {
      fourHourly.value = !fourHourly.value
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
    
    function clearForecast() {
        store.commit('clearForecast')
    }

    return {
      toggle4Hourly,
      multipleOf4,
      forecastedData,
      temperature,
      wind,
      precip,
      fourHourly,
      moreForecast,
      toggleMoreForecast,
      clearForecast
    }
  }
}
</script>

<style>

</style>