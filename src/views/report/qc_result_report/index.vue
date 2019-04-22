<template>
  <div>
    <div class='chart-container'>
      <chart height='100%' width='100%'></chart>
    </div>
  </div>
</template>

<script>
  import Chart from '@/components/Charts/qc_result_reportChart'

  export default {
    name: 'qc_result_report_',
    components: { Chart }
  }
</script>

<style scoped>
  /* .chart-container{
    position: relative;
    padding: 20px;
    width: 100%;
    height:85vh;
  } */
</style>

