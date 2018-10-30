<template>
  <div class="container">
    <div class='chart-container'>
      <chart height='100%' width='100%'></chart>
    </div>
  </div>
</template>

<script>
  import Chart from '@/components/Charts/quality_mark_reportChart'

  export default {
    name: 'quality_mark_reportChart',
    components: { Chart }
  }
</script>

<style scoped>
  .chart-container{
    position: relative;
    padding: 20px;
    width: 100%;
    height:85vh;
  }
</style>

