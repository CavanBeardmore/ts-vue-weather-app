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
      <button @click="toggle('wind', 'k')" v-show="wind === 'm' && moreCurrent" class="toggle-button"> Show in Kilometers </button>
      <button @click="toggle('wind', 'm')" v-show="wind === 'k' && moreCurrent" class="toggle-button"> Show in Miles </button>
      <button @click="toggle('precip', 'mm')" v-show="precip === 'in' && moreCurrent" class="toggle-button"> Show in Millimeters </button>
      <button @click="toggle('precip', 'in')" v-show="precip === 'mm' && moreCurrent" class="toggle-button"> Show in Inches </button>
    </div>

    <!-- Errors -->
    <p style="color: darkred">{{inputError}}</p>
    <h4 style="color: darkred" v-if="requestError">{{requestError}}</h4>
  </div>

  <div class="weatherdata">
  <!-- current weather data -->
    <div class="current" v-if="currentData">
      <h2>Current Weather:</h2>
      <h3>{{currentData.location.name}}</h3>
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
          <td v-if="moreCurrent" v-show="wind === 'k'">{{currentData.current.vis_km}} km</td>
        </tr>
      </table>
      <button @click="toggleMoreCurrent" class="button">Show More Information</button> 
    </div>
    <!-- forecasted weather data -->
    <div class="forecast" v-if="forecastedData">
      <h2>Forecasted Weather:</h2>
      <h3>{{forecastedData.location.name}}</h3>
      <div class="forecast-controls">
        <button @click="toggleMoreForecast" class="button">Show More Information</button> 
        <button @click="toggle4Hourly" class="button">Show Four Hourly Data</button>
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
    const moreForecast: Ref<boolean> = ref(false);
    const fourHourly: Ref<boolean> = ref(false);

    //DOM messages
    const inputError: Ref<string> = ref('');

    //strings
    const temperature: Ref<string> = ref('c');
    const wind: Ref<string> = ref('m');
    const precip: Ref<string> = ref('in');

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

    function toggleMoreCurrent() {
      moreCurrent.value = !moreCurrent.value
    }

    function toggleMoreForecast() {
      moreForecast.value = !moreForecast.value
    }

    function toggle(m: string, v: string) {
      if (m === 'temp') {
        temperature.value = v
      } else if (m === 'wind') {
        wind.value = v
      } else if (m === 'precip') {
        precip.value = v
      }
    }

    function toggle4Hourly(date: string) {
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
      wind,
      precip,
      toggleMoreForecast,
      moreForecast,
      toggle4Hourly,
      fourHourly,
      multipleOf4
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