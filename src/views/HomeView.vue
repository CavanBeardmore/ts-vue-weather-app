<template>

  <h1>Weather App</h1>

  <form>
    <div v-on:submit.prevent class="user-input">
      <label for="weatherInput" class="w-label">Get weather data:</label>
      <input name="weatherInput" type="text" placeholder="London" v-model="locationInput" class="w-input">
    </div>
    
    <div class="days-input">
      <p class="d-label">Amount of forecasted days:</p>
      <button @click="decrement(daysInput)" :disabled="!decrementBool" class="d-button">-</button>
      <h4 class="days">{{daysInput}}</h4>
      <button @click="increment(daysInput)" :disabled="!incrementBool" class="d-button">+</button>
    </div>

    <div class="input-buttons">
      <button type="submit" @click="getCurrent(locationInput)" :disabled="!locationInput" class="i-button">Get current weather</button>
      <button type="submit" @click="getForecast(locationInput, daysInput)" :disabled="!locationInput" class="i-button">Get forecasted weather</button>
    </div>
  </form>

  <!-- Errors -->
  <p style="color: darkred">{{inputError}}</p>
  <h4 style="color: darkred" v-if="requestError">{{requestError}}</h4>

  <!-- current weather data -->
  <div class="current">
    <h3 v-if="currentData">Current Weather:</h3>
    <table class="current-list" v-if="currentData">
      <tr>
        <th>Location:</th>
        <th>Condition:</th>
        <th>Time:</th>
        <th>Temp:</th>
      </tr>
      <tr>
        <td>{{currentData.location.name}}</td>
        <td><img :src="currentData.current.condition.icon"></td>
        <td>{{formattedTime}}</td>
        <td>{{currentData.current.temp_c}} °C</td>
      </tr>
    </table>
    <div class="more-current">    
      <table class="current-list" v-if="currentData">
        <tr>
          <th>Location:</th>
          <th>Condition:</th>
          <th>Time:</th>
          <th>Temp:</th>
        </tr>
        <tr>
          <td>{{currentData.location.name}}</td>
          <td><img :src="currentData.current.condition.icon"></td>
          <td>{{formattedTime}}</td>
          <td>{{currentData.current.temp_c}} °C</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- forecasted weather data -->
  <div class="forecast">
    <ul>
      <h3 v-if="forecastedData">Forecasted Weather:</h3>
      <p v-if="forecastedData">{{forecastedData.location.name}}</p>
    </ul>
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

    //DOM messages
    const inputError: Ref<string> = ref('');

    //computed
    const currentData = computed<Object>(() => store.getters.getCWData);
    const forecastedData = computed<Object>(() => store.getters.getFWData);
    const requestError = computed<string>(() => store.getters.getError);
    const formattedTime = computed<Object>(() => {
      var time = store.getters.getCWData.location.localtime.split(' ')[1]

      return time
    });
    const formattedDate = computed<Object>(() => {
      var date = store.getters.getCWData.location.localtime.split(' ')[0].split('-').reverse().join('-')

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
      formattedDate
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
  height: px;
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
  width: fit-content
}

td, td {
  padding: 15px;
}
</style>