<template>
  <div class="ly-emotion" >
    <slot></slot>
  </div>
</template>

<script>
import data from '@/api/emoji-data1'
export default {
  name: 'ly-emotion',
  data() {
    return {
      emojiData: JSON.parse(data)
    }
  },
  methods: {
    showData(unicode) {
      for (var i in this.emojiData) {
        if (unicode === i) {
          return this.emojiData[unicode]
        }
      }
    }
  },
  mounted() {
    const name = this.$el.innerHTML
    var imgName = this.showData(name)
    const imgHTML = `<img src="../../../static/emoji/` + imgName + `" align="middle" width='26px' height='26px'>`
    this.$nextTick(() => {
      this.$el.innerHTML = imgHTML
    })
  }
}
</script>
<style scoped>
.ly-emotion {
  display: inline-block
}
.ly-static-emotion {
  width: 24px;
  height: 24px;
  display: inline-block;
}
</style>
