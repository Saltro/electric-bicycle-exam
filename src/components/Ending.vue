<template>
  <div class="container">
    <van-button @click="restart">Re:0</van-button>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  methods: {
    restart () {
      console.log('Restart')
      this.$router.push({name: 'Launch'})
    }
  },
  components: {
    [Button.name]: Button
  }
}
</script>

<style>

</style>
