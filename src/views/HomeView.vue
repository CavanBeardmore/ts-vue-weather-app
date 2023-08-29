<template>
  <h1>Weather App</h1>
  <form>
    <label for="weatherInput">Get weather data:</label>
    <input name="weatherInput" type="text" placeholder="London" v-model="locationInput">
    <button @click="decrement(daysInput)" :disabled="!decrementBool">-</button>
    <h4>{{daysInput}}</h4>
    <button @click="increment(daysInput)" :disabled="!incrementBool">+</button>
    <button @click="getCurrent()" :disabled="!locationInput">Get current weather</button>
    <button @click="getForecast()" :disabled="!locationInput">Get forecasted weather</button>
  </form>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { ref } from 'vue';
import type { Ref } from 'vue';

export default({
    setup() {
    
    const store = useStore();

    const locationInput: Ref<string> = ref('');
    const daysInput: Ref<number> = ref(1);

    const incrementBool: Ref<boolean> = ref(true);
    const decrementBool: Ref<boolean> = ref(false);

    function getCurrent(location: string) {
      store.dispatch('getCurrentData', { location });
    }

    function getForecast(location: string, days: number) {
      store.dispatch('getForecastedData', { location, days });
    }

    function increment(num: number){
      if (num < 10) {
        daysInput.value++;
        decrementBool.value = true;
      } else {
        incrementBool.value = false;
      }
    }

    function decrement(num: number){
      if (num > 1) {
        daysInput.value--
        incrementBool.value = true;
      } else {
        decrementBool.value = false;
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
      decrementBool
    }
  }
})
</script>>



<style>

</style>