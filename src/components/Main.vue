<template>
  <div class="container">
    <span id="audio__notice" :class="{'hidden': isAudioCanPlay}">音乐加载中...</span>
    <div id="audio__controller" @click="isAudioPlay = $refs.audio.paused" :class="{'show': isAudioCanPlay}">
      <svg t="1634018866598" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7735" width="200" height="200" :style="{animationPlayState: isAudioPlay ? 'running' : 'paused'}"><path d="M512 960A448 448 0 1 1 802.133333 170.666667a42.666667 42.666667 0 0 1-55.466666 65.493333 362.666667 362.666667 0 1 0 112 170.666667l-226.346667 226.133333a170.666667 170.666667 0 1 1 44.16-164.906667l165.546667-167.04a42.666667 42.666667 0 0 1 37.333333-13.653333 42.666667 42.666667 0 0 1 32.426667 23.04A448 448 0 0 1 512 960z m0-533.333333a85.333333 85.333333 0 0 0-60.373333 145.706666 87.466667 87.466667 0 0 0 120.746666 0l2.133334-2.133333 1.066666-1.493333A85.333333 85.333333 0 0 0 512 426.666667z" p-id="7736" :fill="isAudioPlay ? '#52C6EF' : '#D0D0D0'"></path></svg>
      <div class="audio__left-arrow" v-if="isAudioCanPlay">
        <svg t="1634050609279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2384" width="200" height="200"><path d="M866.92864 476.29312a35.84 35.84 0 1 1 0 71.68h-696.32a35.82976 35.82976 0 0 1-35.84-35.84c0-19.80416 16.03584-35.84 35.84-35.84h696.32z" fill="#e6e6e6" p-id="2385"></path><path d="M221.2864 512.13312l213.59616-213.59616a35.84 35.84 0 0 0-50.67776-50.688l-238.9504 238.9504a35.84 35.84 0 0 0 0 50.67776l238.9504 238.9504a35.84 35.84 0 0 0 50.67776-50.688l-213.59616-213.6064z" fill="#e6e6e6" p-id="2386"></path></svg>
      </div>
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
    return {
      curPage: 0,
      pages: [
        {
          id: 0,
          type: 'start'
        }, {
          id: 1,
          type: 'question',
          question: {
            id: 1,
            title: '骑电动车上坡时，如果马力不足，可以用走S型路线的方式上坡。',
            options: [
              {
                id: 0,
                text: '✔'
              }, {
                id: 1,
                text: '✘'
              }
            ],
            ansOptions: [1],
            answer: '上坡时马力不足，可以采用下车靠边推行的方式，千万不要走“s”弯路线！那样很危险！'
          }
        }, {
          id: 2,
          type: 'question',
          question: {
            id: 2,
            title: '在教学楼附近行驶时，前方出现行人占道现象，应当鸣笛提醒，并减速缓慢超越。',
            options: [
              {
                id: 0,
                text: '✔'
              }, {
                id: 1,
                text: '✘'
              }
            ],
            ansOptions: [1],
            answer: '在教学楼附近是不可以鸣喇叭的哦！如果要遇到前方行人占道，可以减速靠近，通过电动车发出的声音提醒行人及时让行！再不然喊一下也可以的嘛~'
          }
        }, {
          id: 3,
          type: 'question',
          question: {
            id: 3,
            title: '在夜间通过急弯路段进行超车时，应当注意观察情况，及时超越前方车辆。',
            options: [
              {
                id: 0,
                text: '✔'
              }, {
                id: 1,
                text: '✘'
              }
            ],
            ansOptions: [1],
            answer: '夜间的急弯是不可以超车的哦！其他不可以超车的路段还包括陡坡（湖滨绝望坡！），窄路（譬如人流密集的樱花大道），拱桥等等。'
          }
        }, {
          id: 4,
          type: 'question',
          question: {
            id: 4,
            title: '图中的驾驶人有几处危险行为？',
            src: 'https://tva3.sinaimg.cn/mw690/005K8PLRgy1gvajrz8a7zj60mj0kudgl02.jpg',
            flexDirection: 'row',
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
            ansOptions: [1],
            answer: '骑行时要佩戴好头盔，并且不能边打电话边骑车哦！'
          }
        }, {
          id: 5,
          type: 'question',
          question: {
            id: 5,
            title: '通过路口时，下列说法不正确的是',
            options: [
              {
                id: 0,
                text: '左转车辆让直行车辆先行'
              }, {
                id: 1,
                text: '左转车辆让右转车辆先行'
              }, {
                id: 2,
                text: '减速，注意观察路口情况'
              }, {
                id: 3,
                text: '在路口时遵循“左转转大弯，右转转小弯”原则'
              }
            ],
            ansOptions: [1],
            answer: '在路口的时候，通行顺序为直行优先通过，其次是左转，最后才是右转，因此左转车辆要为直行车辆让路，右转车辆要最后通行！通过路口时不仅要减速慢行注意观察，还要遵守“左转转大弯，右转转小弯”的原则哦。'
          }
        }, {
          id: 6,
          type: 'question',
          question: {
            id: 6,
            title: '在路面湿滑或泥泞的地段行车，下列说法正确的是',
            options: [
              {
                id: 0,
                text: '注意观察，及时刹停'
              }, {
                id: 1,
                text: '减速慢行，轻捏刹车'
              }, {
                id: 2,
                text: '路过水坑时要快速驶过'
              }, {
                id: 3,
                text: '下雨时骑车可以撑伞'
              }
            ],
            ansOptions: [1],
            answer: '路面泥泞或湿滑时，轮胎附着力减小，此时贸然刹车会导致车辆侧滑！这个是骑车应当减速慢行，下坡时轻点刹车及时减速，千万不能一边打伞一边骑车哦！'
          }
        }, {
          id: 7,
          type: 'question',
          question: {
            id: 7,
            title: '关于校园道路安全骑行，下列说法正确的是',
            options: [
              {
                id: 0,
                text: '可以短时间双手离开转向把骑行'
              }, {
                id: 1,
                text: '车辆密集时超车可以越过中线超越车辆'
              }, {
                id: 2,
                text: '前方机动车占道时，紧贴机动车并加速超越'
              }, {
                id: 3,
                text: '提前熟悉好路线，行驶时不随意刹停看导航'
              }
            ],
            ansOptions: [3],
            answer: '双手扶稳方向把是最基础的骑行准则！车辆密集时超车也不能越过中线（参考上下学时的樱花大道）前方机动车占道时，应该保持一定距离跟在后面，还有，路上走着走着突然刹停真的很过分！'
          }
        }, {
          id: 8,
          type: 'question',
          question: {
            id: 8,
            title: '下列标志的含义是',
            src: '/static/images/stop_dashing.jpg',
            flexDirection: 'row',
            options: [
              {
                id: 0,
                text: '禁止冲坡'
              }, {
                id: 1,
                text: '注意前方陡坡'
              }, {
                id: 2,
                text: '请勿骑车'
              }, {
                id: 3,
                text: '禁止滑板'
              }
            ],
            ansOptions: [0],
            answer: '当然是“禁止冲坡”啦'
          }
        }, {
          id: 9,
          type: 'question',
          question: {
            id: 9,
            title: '驾驶电动车需要在路边停车时怎样选择停车地点？',
            options: [
              {
                id: 0,
                text: '在人行道上停放'
              }, {
                id: 1,
                text: '在路边随意停放'
              }, {
                id: 2,
                text: '在停车泊位内有序停放'
              }, {
                id: 3,
                text: '靠左侧路边停放'
              }
            ],
            ansOptions: [2],
            answer: '停车时要在停车泊位内有序停放，不要挡住别人出来的路了！'
          }
        }, {
          id: 10,
          type: 'question',
          question: {
            id: 10,
            title: '2021年9月7日9时许，刘某在湖滨大道上骑着安装有遮阳伞的电动车在下坡过程中试图超越梁某驾驶的电动车，导致梁某摔倒，受轻伤。此次事件中，刘某有哪些过错？（双选）',
            options: [
              {
                id: 0,
                text: '非法改装电动车'
              }, {
                id: 1,
                text: '超速驾驶'
              }, {
                id: 2,
                text: '陡坡超车'
              }, {
                id: 3,
                text: '超员驾驶'
              }
            ],
            ansOptions: [0, 2],
            answer: '电动车上禁止加装遮阳伞等部件！陡坡超车真的很危险！'
          }
        }, {
          id: 11,
          type: 'end'
        }
      ],
      score: 0,
      loop: 0,
      scrollTop: 0,
      isRestartDialogShow: false,
      restartDialogButtons: ['确定', '取消'],
      isEndLoadingShow: true,
      isAudioCanPlay: false,
      dummyIsAudioPlay: true
    }
  },
  computed: {
    isAudioPlay: {
      get () {
        // this.dummyIsAudioPlay = !this.$refs.audio.paused
        // console.log(this.dummyIsAudioPlay)
        return this.dummyIsAudioPlay
      },
      set (value) {
        // console.log(this.$refs.audio.paused, value)
        if (value) {
          this.$refs.audio.play()
          this.dummyIsAudioPlay = true
        } else {
          this.$refs.audio.pause()
          this.dummyIsAudioPlay = false
        }
        // console.log(this.$refs.audio.paused)
      }
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
    }
  },
  mounted () {
    this.isAudioPlay = false
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

#audio__notice {
  position: absolute;
  top: 8px;
  left: 6px;
  color: white;
  transition: all 0.5s ease;
}

#audio__notice.hidden {
  opacity: 0;
  top: 33px;
}

#audio__controller {
  position: absolute;
  top: -21px;
  left: 6px;
  width: 25px;
  height: 25px;
  opacity: 0;
  transition: all 0.5s ease;
}

#audio__controller.show {
  opacity: 1;
  top: 6px;
}

#audio__controller .icon {
  height: 100%;
  width: 100%;
  animation: rotate 6s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

#audio__controller .audio__left-arrow {
  position: absolute;
  left: 36px;
  top: 3px;
  height: 16px;
  width: 16px;
  animation: flash 6s 5s ease backwards 1;
  opacity: 0;
}

@keyframes flash {
  from {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

#audio__controller .audio__left-arrow .icon {
  animation: notice 1.5s ease infinite;
}

@keyframes notice {
  from {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(15px);
  }
  to {
    transform: translateX(0px);
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
