<template>
  <div class="container">
    <div id="audio__controller" @click="isAudioPlay = !isAudioPlay" v-if="isAudioCanPlay" :style="{animationPlayState: isAudioPlay ? 'running' : 'paused'}">
      <svg t="1634018866598" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7735" width="200" height="200"><path d="M512 960A448 448 0 1 1 802.133333 170.666667a42.666667 42.666667 0 0 1-55.466666 65.493333 362.666667 362.666667 0 1 0 112 170.666667l-226.346667 226.133333a170.666667 170.666667 0 1 1 44.16-164.906667l165.546667-167.04a42.666667 42.666667 0 0 1 37.333333-13.653333 42.666667 42.666667 0 0 1 32.426667 23.04A448 448 0 0 1 512 960z m0-533.333333a85.333333 85.333333 0 0 0-60.373333 145.706666 87.466667 87.466667 0 0 0 120.746666 0l2.133334-2.133333 1.066666-1.493333A85.333333 85.333333 0 0 0 512 426.666667z" p-id="7736" :fill="isAudioPlay ? '#52C6EF' : '#D0D0D0'"></path></svg>
    </div>
    <audio src="http://scooter.saltroping.com/static/audio.mp3" ref="audio" muted autoplay @canplay="isAudioCanPlay = true" loop></audio>
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
            @swiperight="prevPage"
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
              <img src="https://tva1.sinaimg.cn/mw690/005K8PLRgy1gvajrzh8abj60r61cbgpb02.jpg" alt="index">
            </div>
            <div v-else-if="page.type === 'end'" id="end">
              <loading class="loading" v-show="isEndLoadingShow"></loading>
              <div v-if="curPage === page.id" class="image__container" :class="{'show': !isEndLoadingShow}">
                <img :src="getEndingImgUrlByScore(score)" alt="考试结果" @load="isEndLoadingShow = false"/>
                <!-- 在最后界面加一个保存图片的“链接” -->
                <span>长按图片保存结果</span>
              </div>
            </div>
          </v-touch>
          <div class="back" :style="{ zIndex: curPage > page.id ? page.id : (pages.length - page.id) * 2 - 1 + pages.length }">
            <div></div>
          </div>
        </div>
      </template>
    </div>
    <my-dialog
      id="restart-dialog"
      content="再试一次？"
      :buttons="restartDialogButtons"
      v-show="isRestartDialogShow"
      @clickResult="dialogClickResult"
    >
    </my-dialog>
  </div>
</template>

<script>
import SingleQuestion from './SingleQuestion.vue'
import Dialog from './Dialog.vue'
import Loading from './Loading.vue'
// import VueTouch from 'vue-touch'

export default {
  data () {
    let json = require('../../static/pages.json')
    return {
      curPage: 0,
      pages: json.pages,
      score: 0,
      loop: 0,
      scrollTop: 0,
      isRestartDialogShow: false,
      restartDialogButtons: ['确认', '取消'],
      isEndLoadingShow: true,
      isAudioPlay: true,
      isAudioCanPlay: false
    }
  },
  components: {
    SingleQuestion,
    'MyDialog': Dialog,
    Loading
  },
  methods: {
    getEndingImgUrlByScore (score) {
      let endingImgUrls = [
        'https://tvax1.sinaimg.cn/mw690/005K8PLRgy1gvajvsqt80j60p018gq7r02.jpg',
        'https://tva4.sinaimg.cn/mw690/005K8PLRgy1gvajvt2kzej60p018ggqg02.jpg',
        'https://tva3.sinaimg.cn/mw690/005K8PLRgy1gvajvtd2rkj60p018gaex02.jpg',
        'https://tva2.sinaimg.cn/mw690/005K8PLRgy1gvajvtk66ij60p018g43d02.jpg',
        'https://tva4.sinaimg.cn/mw690/005K8PLRgy1gvajvqvjm5j60p018g79502.jpg',
        'https://tva3.sinaimg.cn/mw690/005K8PLRgy1gvajvr34a8j60p018g43d02.jpg',
        'https://tvax3.sinaimg.cn/mw690/005K8PLRgy1gvajvrdbctj60p018g43d02.jpg',
        'https://tva3.sinaimg.cn/mw690/005K8PLRgy1gvajvrlzcaj60p018g79502.jpg',
        'https://tva2.sinaimg.cn/mw690/005K8PLRgy1gvajvrxsn3j60p018ggqh02.jpg',
        'https://tva3.sinaimg.cn/mw690/005K8PLRgy1gvajvs5amhj60p018gn4402.jpg',
        'https://tvax3.sinaimg.cn/mw690/005K8PLRgy1gvajvse7tyj60oz18g45902.jpg'
      ]
      return endingImgUrls[score / 10]
    },
    nextPage () {
      // 如果当前题目未完成，则阻止翻页
      // 米神：这个东西很膈应
      // if (this.lock) {
      //   Toast.fail('完成当前题目才能进入下一题')
      //   return
      // }
      if (this.curPage < this.pages.length - 1) {
        this.curPage++
        // 如果此页为倒数第一题，则尝试缓存有可能用到的后三张图片
        if (this.curPage === this.pages.length - 3) {
          const preloadImgs = []
          for (let i = this.curPage; i <= this.pages.length - 1; i++) {
            preloadImgs.push(this.getEndingImgUrlByScore(i * 10))
          }
          for (let idx in preloadImgs) {
            let image = new Image()
            image.src = preloadImgs[idx]
          }
        }
      } else {
        // 最后一页改为使用按钮重开，保留这种方式
        // 如果为最后一页则重开
        this.isRestartDialogShow = true
      }
    },
    prevPage () {
      if (this.curPage < this.pages.length - 1 && this.curPage > 0) {
        this.curPage--
      } else if (this.curPage >= this.pages.length - 1) {
        this.isRestartDialogShow = true
      }
    },
    dialogClickResult (index) {
      console.log(index)
      if (index === 0) {
        this.restart()
      }
      this.isRestartDialogShow = false
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
  watch: {
    isAudioPlay (newValue, oldValue) {
      console.log(this.$refs.audio.paused)
      if (newValue) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    }
  },
  mounted () {
    console.log(this)
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

#audio__controller {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 25px;
  height: 25px;
  animation: rotate 6s linear infinite;
}

#audio__controller .icon {
  height: 100%;
  width: 100%;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
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
  pointer-events: none;
}

#book::after {
  content: '向左滑动进入下一页';
  position: absolute;
  bottom: -25px;
  color: white;
  opacity: 0.2;
  animation: 14s linear infinite notice_fly;
  pointer-events: none;
}

@keyframes notice_fly {
  from {
    transform: translateX(55vw);
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
  border-radius: 20px 0 0 20px;
  position: absolute;
}

.page {
  height: 100%;
  width: calc(100% - 20px);
  margin: 0 0 0 20px;
  /* padding: 30px 20px 30px 15px; */
  /* box-sizing: border-box; */
  /* background-color: rgba(255, 255, 255, 0.85); */
  border-radius: 0 5px 5px 0;
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
  border-radius: 0 5px 5px 0;
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
  border-radius: 0 5px 5px 0;
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

#start, #end {
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

#end .image__container {
  position: relative;
  width: 100%;
  height: 100%;
  display: none;
}

#end .image__container.show {
  animation: 1.75s 0.5s ease-out backwards show_ending;
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

.image__container > img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  /* 手机端在操作时，图片的长按不会影响顶层的左划 */
  /* pointer-events: none; */
}

.image__container > span {
  position: absolute;
  bottom: 15px;
  font-size: 12px;
  color: white;
  -webkit-text-stroke: 0.75px black;
}

#restart-dialog {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
