<template>
  <div class="container">
    <p>{{ question }}</p>
    <van-button :plain="pickedOptionId == option.id ? false : true" type="primary" :disabled="confirmed"
      @click="pickedOptionId = option.id" v-for="option in options" :key="option.id">
        {{ option.text }}
    </van-button>
    <van-button @click="confirmAns" v-show="!confirmed">确定</van-button>
    <p class="answer" v-show="confirmed">{{ answer }}</p>
    <van-button @click="nextQuestion" v-show="confirmed">下一题</van-button>
  </div>
</template>

<script>
import { Button, Notify } from 'vant'

export default {
  name: 'SingleQuestion',
  data () {
    return {
      pickedOptionId: -1,
      confirmed: false
    }
  },
  props: {
    question: String,
    options: Array,
    answer: String,
    ansOptionId: Number
  },
  methods: {
    confirmAns () {
      this.confirmed = true
      if (this.pickedOptionId === this.ansOptionId) {
        Notify({type: 'success', message: '恭喜你'})
      } else {
        Notify({type: 'danger', message: '真可惜'})
      }
    },
    nextQuestion () {
      this.$emit('next')
    }
  },
  components: {
    [Button.name]: Button,
    [Notify.Component.name]: Notify.Component
  }
}
</script>

<style>

</style>
