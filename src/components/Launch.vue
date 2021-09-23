<template>
  <div class="container">
    <van-button @click="start">开始</van-button>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  methods: {
    start () {
      // console.log(this)
      this.$router.push({name: 'Main'})
    }
  },
  components: {
    [Button.name]: Button
  }
}
</script>

<style>

</style>
