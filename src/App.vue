<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@font-face {
  font-family: 'AaJueXingHei';
  src: url('/static/AaJXH.ttf') format('truetype');
}

@font-face {
  font-family: 'ZCOOL';
  src: url('/static/ZCOOL.ttf') format('truetype');
}

#app {
  font-family: 'AaJueXingHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
