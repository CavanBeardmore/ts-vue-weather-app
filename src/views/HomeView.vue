<template>

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
    <button @click="toggle('wind', 'k')" v-show="wind === 'm'" class="toggle-button"> Show in KPH </button>
    <button @click="toggle('wind', 'm')" v-show="wind === 'k'" class="toggle-button"> Show in MPH </button>
  </div>

  <!-- Errors -->
  <p style="color: darkred">{{inputError}}</p>
  <h4 style="color: darkred" v-if="requestError">{{requestError}}</h4>

  <!-- current weather data -->
  <div class="current" v-if="currentData">
    <h3>Current Weather:</h3>
    <h4>{{currentData.location.name}}</h4>
    <table class="current-list">
      <tr>
        <th>Condition:</th>
        <th>Time:</th>
        <th>Temp:</th>
      </tr>
      <tr>
        <td><img :src="currentData.current.condition.icon"></td>
        <td>{{formattedTime}}</td>
        <td v-show="temperature === 'c'">{{currentData.current.temp_c}} °C</td>
        <td v-show="temperature === 'f'">{{currentData.current.temp_f}} °F</td>
      </tr>
    </table>
    <button @click="toggleMoreCurrent" class="button">More Information</button>
    <div class="more-current">    
      <table v-if="moreCurrent">
        <tr>
          <th>Condition:</th>
          <th>Time:</th>
          <th>Temp:</th>
          <th>Wind Speed:</th>
          <th>Wind Direction</th>
        </tr>
        <tr>
          <td><img :src="currentData.current.condition.icon"></td>
          <td>{{formattedTime}}</td>
          <td v-show="temperature === 'c'">{{currentData.current.temp_c}} °C</td>
          <td v-show="temperature === 'f'">{{currentData.current.temp_f}} °F</td>
          <td v-show="wind === 'm'">{{currentData.current.wind_mph}} MPH</td>
          <td v-show="wind === 'k'">{{currentData.current.wind_kph}} KPH</td>
          <td>{{currentData.current.wind_dir}}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- forecasted weather data -->
  <div class="forecast" v-if="forecastedData">
    <h3>Forecasted Weather:</h3>
    <h4>{{forecastedData.location.name}}</h4>
    <div v-for="day in forecastedData.forecast.forecastday">
      <table>
        <tr>
          <th>Date:</th>
          <th>Condition:</th>
          <th>Temp:</th>
          <th>Chance of rain:</th>
        </tr>
        <tr>
          <td>{{day.date}}</td>
          <td><img :src="day.day.condition.icon"></td>
          <td>{{day.day.maxtemp_c}} °C</td>
          <td>{{day.day.daily_chance_of_rain}}%</td>
        </tr>
      </table>
    </div>
  </div>

</template>

<script lang="ts">
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';

export default({
    setup() {
    
    const store = useStore();

    //inputs
    const locationInput: Ref<string> = ref('');
    const daysInput: Ref<number> = ref(1);

    //booleans
    const incrementBool: Ref<boolean> = ref(true);
    const decrementBool: Ref<boolean> = ref(false);
    const moreCurrent: Ref<boolean> = ref(false);

    //DOM messages
    const inputError: Ref<string> = ref('');

    //strings
    const temperature: Ref<string> = ref('c');
    const wind: Ref<string> = ref('m');

    //computed
    const currentData = computed<Object>(() => store.getters.getCWData);
    const forecastedData = computed<Object>(() => store.getters.getFWData);
    const requestError = computed<string>(() => store.getters.getError);
    const formattedTime = computed<Object>(() => {
      var time = store.getters.getCWData.location.localtime.split(' ')[1]

      return time
    });
    const formattedDate = computed<Object>(() => {
      var date = store.getters.getFWData.location.localtime.split(' ')[0].split('-').reverse().join('-')

      return date
    });

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
      if (num <= 9) {
        daysInput.value++;
        decrementBool.value = true;
      } else {
        incrementBool.value = false;
        inputError.value = 'Number of days cannot be more than 10.'
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

    function toggleMoreCurrent() {
      moreCurrent.value = !moreCurrent.value
    }

    function toggle(m: string, v: string) {
      if (m === 'temp') {
        temperature.value = v
      } else if (m === 'wind') {
        wind.value = v
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
      currentData,
      forecastedData,
      requestError,
      formattedTime,
      formattedDate,
      moreCurrent,
      toggleMoreCurrent,
      temperature,
      toggle,
      wind
    }
  }
})
</script>>



<style>
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
}

.current{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

table, th, td {
  border:1px solid black;
  width: fit-content;
}

th, td {
  padding: 15px;
  text-align: center;
}

.button {
  width: fit-content;
  padding: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
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

</style>