<template>
  <div class="ly-emotion" >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ly-emotion',
  mounted() {
    const name = this.$el.innerText
    const list = ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', "/::'(", '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '[囧]', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', "/::'|", '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer', '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok', '/:love', '/:<L>', '/:jump', '/:shake', '/:<O>', '/:circle', '/:kotow', '/:turn', '/:skip', '[挥手]', '/:#-0', '/:hiphot', '/:<&', '/:&>']
    const index = list.indexOf(name)
    const imgHTML = `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" width="26px" height="26px">`
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
  width: 26px;
  height: 26px;
  display: inline-block;
}
</style>
