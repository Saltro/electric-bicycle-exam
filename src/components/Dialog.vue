<template>
  <div>
    <div id="dialog__overlay" @click="0">
      <div id="dialog__card">
        <span class="dialog__content">{{ content }}</span>
        <div id="dialog__buttons">
          <template v-for="(button, index) in buttons">
            <button class="dialog__button" :key="index" @click="clickResult(index)">{{ button }}</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
    buttons: Array
  },
  methods: {
    clickResult (index) {
      this.$emit('clickResult', index)
    }
  }
}
</script>

<style scoped>
#dialog__overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

#dialog__card {
  position: absolute;
  width: 80%;
  /* height: 50%; */
  box-sizing: border-box;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.dialog__content {
  font-size: 16px;
  padding: 30px;
  text-align: left;
  flex: 1;
}

#dialog__buttons {
  flex: 0 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 12px 12px;
}

.dialog__button {
  padding: 12px;
  flex: 1;
  background-color: white;
  border: initial;
  border-right: 1px solid rgba(112, 112, 112, 0.2);
  border-top: 1px solid rgba(112, 112, 112, 0.2);
  pointer-events: initial;
  font-family: 'AaJueXingHei';
}

#dialog__buttons .dialog__button:first-child {
  border-radius: 0 0 0 12px;
}

#dialog__buttons .dialog__button:last-child {
  border-radius: 0 0 12px 0;
  border-right: initial;
}
</style>
