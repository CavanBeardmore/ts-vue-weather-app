<template>
  <div class="wrapper">
    <h1 class="locations-title">Locations</h1>
    <div class="location-controls"> 
      <button @click="toggle('temp', 'f')" v-show="temperature === 'c'" class="toggle-button"> Show in Fahrenheit </button>
      <button @click="toggle('temp', 'c')" v-show="temperature === 'f'" class="toggle-button"> Show in Celsius </button>
      <button @click="toggle('wind', 'k')" v-show="wind === 'm'" class="toggle-button"> Show in Kilometers </button>
      <button @click="toggle('wind', 'm')" v-show="wind === 'k'" class="toggle-button"> Show in Miles </button>
      <button @click="toggle('precip', 'mm')" v-show="precip === 'in'" class="toggle-button"> Show in Millimeters </button>
      <button @click="toggle('precip', 'in')" v-show="precip === 'mm'" class="toggle-button"> Show in Inches </button>
    </div>
    <div>
      <div class="location-list" v-for="location in locationsList" :key="location.name">
        <ul class="location" v-if="location.currentData.location && location.currentData.current">
          <h2>{{location.name}}</h2>
          <p v-if="requestError" style="color: red">{{requestError}}</p>
          <table>
            <tr>
              <th>Time:</th>
              <th>Condition:</th>
              <th>Temp:</th>
            </tr>
            <tr>
              <td>{{location.currentData.location.localtime.split(' ')[1]}}</td> 
              <td><img :src="location.currentData.current.condition.icon"></td> 
              <td v-show="temperature === 'c'">{{location.currentData.current.temp_c}} °C</td>
              <td v-show="temperature === 'f'">{{location.currentData.current.temp_f}} °F</td>
            </tr>
          </table>
          <button class="button">Get 3 Day Forecast</button>
          <button class="button">Show More Information</button>
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
    
    //computed
    const locationsList = computed<[Location]>(() => store.getters.getLocations)
    const temperature = computed<string>(() => store.getters.getTemp)
    const wind = computed<string>(() => store.getters.getWind)
    const precip = computed<string>(() => store.getters.getPrecip)

    //errors
    const requestError: Ref<string> = ref('');

    onMounted(() => {
      for (let i = 0; i < locationsList.value.length; i++) {
        getData(locationsList.value[i].formatCurrent(
        locationsList.value[i].currentURLOne,
        locationsList.value[i].name,
        locationsList.value[i].currentURLTwo))
        .then((data) => {
          console.log(data)
          console.log(locationsList.value.length)
          console.log(i)
          locationsList.value[i].addData(data)
        })
        .catch((err) => {
          requestError.value = err
        })
      }
    })

    return {
      locationsList,
      requestError,
      temperature,
      wind,
      precip

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