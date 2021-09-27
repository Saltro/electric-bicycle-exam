<template>
  <div class="question-container">
    <div id="top">
      <span class="id">{{ id }}</span>
      <span class="title">{{ title }}</span>
    </div>
    <div id="img-temp" :style="{ flexDirection: flexDirectionComputed }">
      <img v-if="src" :src="src">
      <div id="options">
        <button
          v-for="option in options"
          :key="option.id"
          class="option"
          :style="{ backgroundColor: option.pickedColor }"
          @click="pickOption(option.id)"
        >
            {{ option.text }}
        </button>
      </div>
    </div>
    <div id="answer">
      <div id="overlay" :class="{ 'close': confirmed }"></div>
      <p class="ans-text">{{ answer }}</p>
    </div>
  </div>
</template>

<script>
import { Button, Notify } from 'vant'
import util from '../utils/util'

export default {
  name: 'SingleQuestion',
  data () {
    return {
      pickedOptions: [],
      confirmed: false
    }
  },
  props: {
    loop: Number,
    title: String,
    id: Number,
    options: Array,
    answer: String,
    ansOptions: Array,
    src: String,
    flexDirection: String
  },
  computed: {
    flexDirectionComputed () {
      if (!this.flexDirection || this.flexDirection === 'column') {
        return 'column'
      } else {
        return 'row'
      }
    }
  },
  watch: {
    loop (newValue, oldValue) {
      this.confirmed = false
      this.pickedOptions = []
      for (let idx in this.options) {
        delete this.options[idx].pickedColor
      }
    }
  },
  methods: {
    pickOption (optionId) {
      // 如果已经选择过了那么直接跳过
      if (util.isItemInArray(optionId, this.pickedOptions)) return
      // 如果已经回答了问题那么选中也不进行处理
      if (this.confirmed) return
      // 判断是否为正确答案之一（存在多选
      let pickRes = util.isItemInArray(optionId, this.ansOptions)
      // console.log(pickRes, optionId, this.ansOptions)
      // 修改样式
      for (let idx in this.options) {
        if (this.options[idx].id === optionId) {
          // 直接添加原来没有的属性，属性是非响应式的，需要使用 this.$set 添加
          // this.options[idx].pickedColor = pickRes ? '#82FF78' : '#FF6C6C'
          this.$set(this.options[idx], 'pickedColor', pickRes ? '#82FF78' : '#FF6C6C')
          break
        }
      }
      // 对是否已完成进行判断（存在多选
      if (!pickRes) {
        this.confirmed = true
        this.$emit('result', false)
      } else {
        this.pickedOptions.push(optionId)
        if (util.compareArray(this.pickedOptions, this.ansOptions)) {
          this.confirmed = true
          this.$emit('result', true)
        }
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Notify.Component.name]: Notify.Component
  }
}
</script>

<style scoped>
.question-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
  pointer-events: none;
}

#top {
  width: 100%;
  /* margin: 0 0 19px 0; */
  display: flex;
  flex-direction: row;
  /* 不可以使用 align-items */
}

#top .id {
  padding: 8px 6px;
  background-color: #FFDA24;
  color: #3E3D3D;
  font-size: 50px;
  display: flex;
  flex: initial;
  align-items: center;
  justify-content: center;
}

#top .title {
  padding: 8px 15px;
  background-color: #333333;
  color: #FFFFFF;
  font-size: 18px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: left;
}

#img-temp {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 15px;
}

#img-temp img {
  width: 60%;
  max-width: 200px;
  border-radius: 10px;
}

#options {
  /* margin: 0 auto 19px; */
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  pointer-events: initial;
}

#options .option {
  width: 100%;
  padding: 8px 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border: initial;
  font-size: 16px;
  background-color: #FFFFFF;
  transition: 0.75s background-color;
}

#answer {
  width: 100%;
  position: relative;
  overflow: hidden;
  /* flex: 1 auto; */
}

/* #answer .text {
  margin: 0 auto;
  padding: 19px 15px;
  font-size: 16px;
  color: transparent;
  transition: all 1s ease;
  background-color: #B0B0B0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  height: 100%;
  box-sizing: border-box;
  text-align: left;
} */

#answer .ans-text {
  margin: 0 auto;
  padding: 19px 15px;
  font-size: 16px;
  text-align: left;
  color: black;
  background-color: #F0F0F0;
}

#overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #B0B0B0;
  transition: 1s transform ease;
}

#overlay.close {
  transform: translateY(150%);
}
</style>
