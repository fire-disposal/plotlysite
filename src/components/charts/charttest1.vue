<template>
  <div>
    <h3 class="text-lg font-bold mb-2">年度发表趋势</h3>
    <div ref="chartDiv" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBiblio } from '../../stores/biblioStore'
import Plotly from 'plotly.js-dist'

const store = useBiblio()
const chartDiv = ref(null)

// 统计每年论文数量
const yearStats = computed(() => {
  const stats = {}
  store.data.forEach(item => {
    const year = item.Year || (item.article_date ? new Date(item.article_date).getFullYear() : null)
    if (year) {
      stats[year] = (stats[year] || 0) + 1
    }
  })
  return stats
})

const plotData = computed(() => {
  const years = Object.keys(yearStats.value).sort()
  return [{
    x: years,
    y: years.map(y => yearStats.value[y]),
    type: 'bar',
    marker: { color: '#3b82f6' }
  }]
})

const plotLayout = computed(() => ({
  title: '',
  xaxis: { title: '年份' },
  yaxis: { title: '论文数量' },
  margin: { t: 20, r: 20, b: 40, l: 40 }
}))
onMounted(() => {
  if (chartDiv.value) {
    Plotly.newPlot(chartDiv.value, plotData.value, plotLayout.value)
  }
})

watch([plotData, plotLayout], () => {
  if (chartDiv.value) {
    Plotly.react(chartDiv.value, plotData.value, plotLayout.value)
  }
})

</script>