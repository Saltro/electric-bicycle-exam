<template>
  <div id="app">
    <main-component></main-component>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    'MainComponent': Main
  }
}
</script>

<style>
@font-face {
  font-family: 'AaJueXingHei';
  src: url('/static/AaJXH.ttf') format('truetype');
}

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'AaJueXingHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
