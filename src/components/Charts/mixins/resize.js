import { debounce } from '@/utils'

export default {
  mounted() {
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
      if (this.chartStaff) {
        this.chartStaff.resize()
      }
      if (this.chartTime) {
        this.chartTime.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHanlder)
  }
}
