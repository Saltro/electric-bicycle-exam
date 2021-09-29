<template>
  <div class="container">
    <div id="book">
      <div id="spine"></div>
      <template v-for="page in pages">
        <div
          :key="page.id"
          class="page"
          :class="{ 'rotate' : curPage > page.id }"
        >
          <v-touch
            @swipeleft="nextPage"
            @panup="scroll"
            @pandown="scroll"
            class="front"
            :class="page.type"
            :style="{ zIndex: (pages.length - page.id) * 2 + pages.length }"
          >
            <single-question
              v-if="page.type === 'question'"
              :loop="loop"
              :title="page.question.title"
              :id="page.question.id"
              :answer="page.question.answer"
              :options="page.question.options"
              :ans-options="page.question.ansOptions"
              :src="page.question.src"
              :flex-direction="page.question.flexDirection"
              :top="scrollTop"
              @result="calcQuestionResult"
            >
            </single-question>
            <div v-else-if="page.type === 'start'" id="start">
              <img src="/static/images/index.jpg"/>
            </div>
            <div v-else-if="page.type === 'end' && curPage === page.id" id="end">
              <img :src="endingImgPrefix + score + '.jpg'"/>
              <!-- 在最后界面加一个保存图片的“链接” -->
              <span>长按图片保存结果</span>
            </div>
          </v-touch>
          <div class="back" :style="{ zIndex: curPage > page.id ? page.id : (pages.length - page.id) * 2 - 1 + pages.length }">
            <div></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SingleQuestion from './SingleQuestion.vue'
import { Dialog } from 'vant'

export default {
  data () {
    let json = require('../../static/pages.json')
    // console.log(json)
    return {
      curPage: 0,
      pages: json.pages,
      score: 0,
      // lock: false,
      loop: 0,
      endingImgPrefix: '/static/images/scores/remake_',
      scrollTop: 0
    }
  },
  components: {
    SingleQuestion
  },
  methods: {
    nextPage () {
      // 如果当前题目未完成，则阻止翻页
      // 米神：这个东西很膈应
      // if (this.lock) {
      //   Toast.fail('完成当前题目才能进入下一题')
      //   return
      // }
      if (this.curPage < this.pages.length - 1) {
        this.curPage++
        // 如果下一页为题目，则上锁
        for (let idx in this.pages) {
          if (this.curPage === this.pages[idx].id) {
            if (this.pages[idx].type === 'question') {
              this.lock = true
            }
            break
          }
        }
      } else {
        // 最后一页改为使用按钮重开，保留这种方式
        // 如果为最后一页则重开
        Dialog.confirm({
          message: '再试一次？'
        }).then(() => {
          this.restart()
        })
      }
    },
    restart () {
      // 返回首页
      this.curPage = this.pages[0].id
      // 增加循环数，触发 SingleQuestion 组件的监听函数
      this.loop++
      // 重置分数
      this.score = 0
    },
    calcQuestionResult (res) {
      this.score += res ? 10 : 0
      if (this.score >= 80 && this.score < 100) {
        // 大于等于 90 分且不到 100 分时显示“新手上路”
        this.endingImgPrefix = '/static/images/scores/xssl_'
      } else if (this.score === 100) {
        // 等于一百分时显示“珞珈山车神”
        this.endingImgPrefix = '/static/images/scores/yyds_'
      }
      // this.lock = false
    },
    scroll (e) {
      // console.log(e)
      // if (e.type === 'panup') {
      //   this.scrollTop -= e.distance / 16
      //   console.log(this.scrollTop)
      // } else if (e.type === 'pandown') {
      //   this.scrollTop += e.distance / 16
      //   console.log(this.scrollTop)
      // }
    }
  },
  mounted () {
    console.log(this.$refs)
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  /* padding: 53px 0 0; */
  background-color: #2D7BC8;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 防止上下提示影响页面滑动 */
  overflow: hidden;
}

#book {
  /* margin: 0 33px; */
  position: absolute;
  height: 90%;
  max-height: 780px;
  width: 90%;
  max-width: 460px;
}

#book::before {
  content: '向左滑动进入下一页';
  position: absolute;
  top: -25px;
  color: white;
  opacity: 0.2;
  animation: 14s linear infinite notice_fly;
}

#book::after {
  content: '向左滑动进入下一页';
  position: absolute;
  bottom: -25px;
  color: white;
  opacity: 0.2;
  animation: 14s linear infinite notice_fly;
}

@keyframes notice_fly {
  from {
    transform: translateX(70vw);
  }
  to {
    transform: translateX(-90vw);
  }
}

#spine {
  /* 书脊处高度总会多 2px */
  height: calc(100% - 2px);
  width: 20px;
  background-color: #FFFDFD;
  border: 1px solid rgba(112, 112, 112, 0.2);
  border-radius: 20px 10px 10px 20px;
  position: absolute;
}

.page {
  height: 100%;
  width: calc(100% - 20px);
  margin: 0 0 0 20px;
  /* padding: 30px 20px 30px 15px; */
  /* box-sizing: border-box; */
  /* background-color: rgba(255, 255, 255, 0.85); */
  border-radius: 5px;
  /* transform-origin: left;
  transform-style: preserve-3d;
  transform: perspective(1500px) rotateY(0deg); */
  position: absolute;
  /* overflow: visible; */
  /* transition: transform 1s ease; */
}

/* .page.rotate {
  pointer-events: none;
} */

.page .front {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 30px 20px 30px 15px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.85);
  border-left: 1px solid #E0E0E0;
  transform-origin: left;
  transform-style: preserve-3d;
  transform: perspective(1500px) rotateY(0deg);
  transition: transform 0.75s ease-in-out;
  /* firefox 无法使用 overlay 属性值 */
  /* overflow: overlay; */
  overflow: hidden;
  backface-visibility: hidden;
}

.page.rotate .front {
  transform: perspective(1500px) rotateY(-180deg);
  background-color: rgba(255, 255, 255, 1);
  /* z-index: 1; */
  /* animation: 0.75s ease forwards turn_page; */
}

.page .back {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  background-color: #F0F0F0;
  transform-origin: left;
  transform-style: preserve-3d;
  transform: perspective(1500px) rotateY(0deg);
  transition: transform 0.75s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  /* pointer-events: none; */
}

.page.rotate .back {
  transform: perspective(1500px) rotateY(-180deg);
}

.page .back > div {
  transition: opacity 0s 0.435s;
  opacity: 0;
}

.page.rotate .back > div {
  opacity: 0.2;
  padding: 30%;
  background-image: url('/static/images/logo_reverse.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.page .front.end, .page .front.start {
  padding: 15px 5px;
  /* overflow: visible; */
}

.page .front.start {
  display: flex;
  align-items: center;
  background-color: #52C6EF;
}

#start {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page .front.end::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 0.2;
  background-image: url('/static/images/logo.png');
  background-repeat: no-repeat;
  background-size: 40%;
  background-position: center;
}

#end {
  position: relative;
  width: 100%;
  height: 100%;
  animation: 1.75s ease-out backwards show_ending;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@keyframes show_ending {
  from {
    opacity: 0;
    transform: scale(1.3);
  }
  50% {
    opacity: 0;
    transform: scale(1.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

#start > img {
  /* 使图片盒子等于图片本身大小，同时又能够满足 contain 要求 */
  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
}

#end > img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  /* 手机端在操作时，图片的长按不会影响顶层的左划 */
  /* pointer-events: none; */
}

#end > span {
  position: absolute;
  bottom: 15px;
  font-size: 12px;
  color: white;
  -webkit-text-stroke: 0.75px black;
}

</style>
