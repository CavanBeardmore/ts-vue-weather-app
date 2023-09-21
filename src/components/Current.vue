<template>
    <div class="current" v-if="currentData">
        <h2>Current Weather:</h2>
        <h3>{{currentData.location.name}}</h3>
        <div class="data-controls">
            <button @click="toggleMoreCurrent" class="button">Show More Information</button>
            <button @click="addLocation(currentData.location.name)" class="button">Add To Locations</button>
            <button @click="clearCurrent" class="button">Clear</button>
        </div>
        <table>
        <tr>
            <th>Condition:</th>
            <th>Time:</th>
            <th>Temp:</th>
            <th v-if="moreCurrent">Wind Speed:</th>
            <th v-if="moreCurrent">Wind Direction:</th>
            <th v-if="moreCurrent">Humidity:</th>
            <th v-if="moreCurrent">Precipitation:</th>
            <th v-if="moreCurrent">Cloud Coverage:</th>
            <th v-if="moreCurrent">UV:</th>
            <th v-if="moreCurrent">Feels Like:</th>
            <th v-if="moreCurrent">Visibility:</th>
        </tr>
        <tr>
            <td><img :src="currentData.current.condition.icon"></td>
            <td>{{formattedTime}}</td>
            <td v-show="temperature === 'c'">{{currentData.current.temp_c}} °C</td>
            <td v-show="temperature === 'f'">{{currentData.current.temp_f}} °F</td>
            <td v-if="moreCurrent" v-show="wind === 'm'">{{currentData.current.wind_mph}} MPH</td>
            <td v-if="moreCurrent" v-show="wind === 'k'">{{currentData.current.wind_kph}} KPH</td>
            <td v-if="moreCurrent">{{currentData.current.wind_dir}}</td>
            <td v-if="moreCurrent">{{currentData.current.humidity}}%</td>
            <td v-if="moreCurrent" v-show="precip === 'in'">{{currentData.current.precip_in}} inches</td>
            <td v-if="moreCurrent" v-show="precip === 'mm'">{{currentData.current.precip_mm}} mm</td>
            <td v-if="moreCurrent">{{currentData.current.cloud}}%</td>
            <td v-if="moreCurrent">{{currentData.current.uv}}</td>
            <td v-if="moreCurrent" v-show="temperature === 'c'" class="feels-like">{{currentData.current.feelslike_c}} °C</td>
            <td v-if="moreCurrent" v-show="temperature === 'f'" class="feels-like">{{currentData.current.feelslike_f}} °F</td>
            <td v-if="moreCurrent" v-show="wind === 'm'">{{currentData.current.vis_miles}} miles</td>
            <td v-if="moreCurrent" v-show="wind === 'k'">{{currentData.current.vis_km}} KM</td>
        </tr>
        </table>
    </div>
</template>

<script lang="ts">
import store from '@/store'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import type { Ref } from 'vue';
import { Location } from '../classes/locationClass'

export default {
 setup() {

    //use store 
    const store = useStore();   

    //error
    const locationError: Ref<string> = ref('');

    //boolean
    const moreCurrent = computed<Object>(() => store.getters.getMoreC);

    //data
    const currentData = computed<Object>(() => store.getters.getCWData);

    //time
    const formattedTime = computed<Object>(() => {
      var time = store.getters.getCWData.location.localtime.split(' ')[1]

      return time
    });

    //measurement toggle
    const temperature = computed<string>(() => store.getters.getTemp);
    const wind = computed<string>(() => store.getters.getWind);
    const precip = computed<string>(() => store.getters.getPrecip);

    //
    /* FUNCTIONS */
    //

    function toggleMoreCurrent() {
      store.commit('updateMoreC')
    }

    function clearCurrent() {
        store.commit('clearCurrent')
    }

    function addLocation(name: string) {
      const array = store.getters.getLocations

      const filtered = array.filter((location: Location) => location.name === name)

      console.log(name, filtered)

      if (filtered.length !== 0) {
        locationError.value = 'This location already exists'
      } else {
        store.commit('addLocation', new Location(
            name,
            'https://api.weatherapi.com/v1/current.json?key=930a60d791f84d648ee164103231807&q=',
            '&aqi=no',
            'https://api.weatherapi.com/v1/forecast.json?key=930a60d791f84d648ee164103231807&q=',
            '&days=',
            '&aqi=no&alerts=no'
            ))
        locationError.value = ''
      }
      console.log(store.getters.getLocations)
    }

    return {
        moreCurrent,
        toggleMoreCurrent,
        currentData,
        temperature,
        wind,
        precip,
        formattedTime,
        clearCurrent,
        addLocation,
        locationError
    }
 }
}
</script>

<style>

</style>