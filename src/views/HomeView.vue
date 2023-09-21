<template>
<div class="wrapper">
  <div class="controls">
    <h1>Weather App</h1>
    <form>
      <div class="user-input">
        <label for="weatherInput" class="w-label">Get weather data:</label>
        <input name="weatherInput" type="text" placeholder="London" v-model="locationInput" class="w-input">
      </div>
      
      <div class="days-input">
        <p class="d-label">Amount of forecasted days:</p>
        <button @click="decrement(daysInput)" type='button' :disabled="!decrementBool" class="d-button">-</button>
        <h4 class="days">{{daysInput}}</h4>
        <button @click="increment(daysInput)" type='button' :disabled="!incrementBool" class="d-button">+</button>
      </div>

      <div class="input-buttons">
        <button 
          type="button" 
          @click="getCurrent(locationInput)" 
          :disabled="!locationInput" 
          class="i-button"
        > Get current weather </button>
        <button 
          type="button" 
          @click="getForecast(locationInput, daysInput)" 
          :disabled="!locationInput" 
          class="i-button"
          > Get forecasted weather </button>
      </div>
    </form>

    <div v-if="forecastedData || currentData"> 
      <button @click="toggle('temp', 'f')" v-show="temperature === 'c'" class="toggle-button"> Show in Fahrenheit </button>
      <button @click="toggle('temp', 'c')" v-show="temperature === 'f'" class="toggle-button"> Show in Celsius </button>
      <button @click="toggle('wind', 'k')" v-show="wind === 'm' && moreCurrent || moreForecast" class="toggle-button"> Show in Kilometers </button>
      <button @click="toggle('wind', 'm')" v-show="wind === 'k' && moreCurrent || moreForecast" class="toggle-button"> Show in Miles </button>
      <button @click="toggle('precip', 'mm')" v-show="precip === 'in' && moreCurrent || moreForecast" class="toggle-button"> Show in Millimeters </button>
      <button @click="toggle('precip', 'in')" v-show="precip === 'mm' && moreCurrent || moreForecast" class="toggle-button"> Show in Inches </button>
    </div>

    <!-- Errors -->
    <p style="color: darkred">{{inputError}}</p>
    <h4 style="color: darkred" v-if="requestError">{{requestError}}</h4>
  </div>

  <div class="weatherdata">
  <!-- current weather data -->
  <Current />
  <!-- forecasted weather data -->
  <Forecast />
  </div>
  
</div>
</template>

<script lang="ts">
import Current from '../components/Current.vue'
import Forecast from '../components/Forecast.vue'
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';

export default({
  components: {
    Current,
    Forecast
  },
    setup() {
    
    const store = useStore();

    //inputs
    const locationInput: Ref<string> = ref('');
    const daysInput: Ref<number> = ref(1);

    //booleans
    const incrementBool: Ref<boolean> = ref(true);
    const decrementBool: Ref<boolean> = ref(false);
    const moreCurrent = computed<Object>(() => store.getters.getMoreC);
    const moreForecast = computed<Object>(() => store.getters.getMoreF);

    //data
    const currentData = computed<Object>(() => store.getters.getCWData);
    const forecastedData = computed<Object>(() => store.getters.getFWData);

    //measurement toggle
    const temperature = computed<string>(() => store.getters.getTemp);
    const wind = computed<string>(() => store.getters.getWind);
    const precip = computed<string>(() => store.getters.getPrecip);

    //DOM messages
    const inputError: Ref<string> = ref('');

    //computed
    const requestError = computed<string>(() => store.getters.getError);
    const formattedDate = computed<Object>(() => {
      var date = store.getters.getFWData.location.localtime.split(' ')[0].split('-').reverse().join('-')

      return date
    });

    //
    /* FUNCTIONS */
    //

    //get functions
    function getCurrent(location: string) {

      store.dispatch('getCurrentData', location );
      locationInput.value = ''
    }

    function getForecast(location: string, days: number) {
      store.dispatch('getForecastedData', { location, days });
      locationInput.value = ''
    }

    //increment and decrement days functions
    function increment(num: number){
      if (num <= 2) {
        daysInput.value++;
        decrementBool.value = true;
      } else {
        incrementBool.value = false;
        inputError.value = 'Number of days cannot be more than 3.'
      }
    }

    function decrement(num: number){
      if (num >= 2) {
        daysInput.value--
        incrementBool.value = true;
      } else {
        decrementBool.value = false;
        inputError.value = 'Number of days cannot be less than 1.'
      }
    }

    function toggle(m: string, v: string) {
      if (m === 'temp') {
        store.commit('updateTemp', v )
      } else if (m === 'wind') {
        store.commit('updateWind', v)
      } else if (m === 'precip') {
        store.commit('updatePrecip', v)
      }
    }


    
    return {
      locationInput,
      daysInput,
      getCurrent,
      getForecast,
      increment,
      decrement,
      incrementBool,
      decrementBool,
      inputError,
      requestError,
      formattedDate,
      toggle,
      temperature,
      wind,
      precip,
      currentData,
      forecastedData,
      moreCurrent,
      moreForecast
    }
  }
})
</script>>



<style>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.controls{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  background-color: lightblue;
  border-radius: 10px;
  padding: 30px;
  margin: 0 auto;
  width: fit-content;
}

.user-input{
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}

.days-input{
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}

input-buttons{
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}

.w-label{
  padding:5px;
}

.w-input{
  padding:5px;
  border-radius: 10px;
}

.d-label{
  padding:5px;
}

.d-button{
  margin: 15px;
  border-radius: 5px;
}

.days {
  padding-top: 5px;
}

.i-button{
  margin: 10px;
  padding-top:5px;
  padding-bottom:5px;
  padding-left:8px;
  padding-right:8px;
  border-radius: 5px;
  text-align: center;
}

.weatherdata {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  margin: 30px;
}

.current{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 30px;
}

.forecast{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin-top: 30px;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 30px;
}

table, th, td {
  border:1px solid black;
}

th, td {
  padding: 20px;
  text-align: center;
  min-width: 50px;
}

.button {
  width: fit-content;
  padding: 5px;
  margin: 15px;
}

.toggle-button {
  width: fit-content;
  padding-top:5px;
  padding-bottom:5px;
  padding-left:8px;
  padding-right:8px;
  margin: 10px;
  border-radius: 5px;
}

table {
  margin-top: 15px;
  margin-bottom: 15px;
  width: 50%;
  margin: 0 auto;
}

.forecast-controls{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}

</style>