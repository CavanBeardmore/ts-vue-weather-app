<template>
  <nav>
    <router-link class="nav-item" to="/">Home</router-link>
    <router-link class="nav-item" to="/locations">Locations</router-link>
  </nav>
  <router-view/>
</template>

<style>
nav {
  background-color: #92ACF8;
  padding: 20px;
  padding-left: 40px;
  padding-right: 40px;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  width: fit-content;
  margin: 0 auto;
  border-style: outset;
}

.nav-item{
  background-color: #0536B0;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: 10px;
  margin-left: 10px;
  color: #F1F1F1;
  border-radius: 15px;
}

.nav-item:hover{
  background-color: #1253F4;
}

nav:hover{
  transform: scale(1.05);
}
</style>
