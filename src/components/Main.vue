<template>
  <div class="container">
    <single-question v-for="question in questions" :key="question.questionId" v-show="question.questionId === currentQuestionId"
      :question="question.question" :answer="question.answer" :options="question.options" :ansOptionId="question.ansOptionId" @next="currentQuestionId++">
    </single-question>
  </div>
</template>

<script>
import SingleQuestion from './SingleQuestion.vue'

export default {
  data () {
    return {
      currentQuestionId: 1,
      questions: [
        {
          questionId: 1,
          question: '骑电动车上坡时，如果马力不足，可以用走S型路线的方式上坡。',
          options: [
            {
              id: 0,
              text: '对'
            }, {
              id: 1,
              text: '错'
            }
          ],
          ansOptionId: 1,
          answer: '上坡时马力不足，可以采用下车靠边推行的方式，千万不要走“s”弯路线！那样很危险！'
        },
        {
          questionId: 2,
          question: '在教学楼附近行驶时，前方出现行人占道现象，应当鸣笛提醒，并减速缓慢超越。',
          options: [
            {
              id: 0,
              text: '对'
            }, {
              id: 1,
              text: '错'
            }
          ],
          ansOptionId: 1,
          answer: '在教学楼附近是不可以鸣喇叭的哦！如果要遇到前方行人占道，可以减速靠近，通过电动车发出的声音提醒行人及时让行！再不然喊一下也可以的嘛~'
        },
        {
          questionId: 3,
          question: '在夜间通过急弯路段进行超车时，应当注意观察情况，及时超越前方车辆。',
          options: [
            {
              id: 0,
              text: '对'
            }, {
              id: 1,
              text: '错'
            }
          ],
          ansOptionId: 1,
          answer: '夜间的急弯是不可以超车的哦！其他不可以超车的路段还包括陡坡（湖滨绝望坡！），窄路（譬如人流密集的樱花大道），拱桥等等。'
        },
        {
          questionId: 4,
          question: '图中的驾驶人有几处危险行为？',
          options: [
            {
              id: 0,
              text: '1'
            }, {
              id: 1,
              text: '2'
            }, {
              id: 2,
              text: '3'
            }, {
              id: 3,
              text: '4'
            }
          ],
          ansOptionId: 1,
          answer: '骑行时要佩戴好头盔，并且不能边打电话边骑车哦！'
        }
      ]
    }
  },
  watch: {
    currentQuestionId (newValue, oldValue) {
      // console.log(newValue, oldValue)
      if (newValue > this.questions.length) {
        console.log('End')
        this.$router.push({name: 'Ending'})
      }
    }
  },
  components: {
    SingleQuestion
  }
}
</script>

<style>

</style>
