<template>
  <div>
    <h3 class="text-lg font-bold mb-2">{{ messages[lang]?.title }}</h3>
    <div ref="chartDiv" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Plotly from 'plotly.js-dist'

const messages = {
  zh: {
    title: '季度销售趋势',
    x: '季度',
    y: '销售额'
  },
  en: {
    title: 'Quarterly Sales Trend',
    x: 'Quarter',
    y: 'Sales'
  }
}

const lang = ref(localStorage.getItem('lang') || 'zh')

const updateLang = () => {
  lang.value = localStorage.getItem('lang') || 'zh'
}
window.addEventListener('storage', updateLang)
window.addEventListener('langchange', updateLang)

const chartDiv = ref(null)

// 模拟数据
const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
const sales = [120, 150, 170, 140]

const plotData = computed(() => [{
  x: quarters,
  y: sales,
  type: 'scatter',
  mode: 'lines+markers',
  marker: { color: '#f59e42' }
}])

const plotLayout = computed(() => ({
  title: '',
  xaxis: { title: messages[lang.value]?.x },
  yaxis: { title: messages[lang.value]?.y },
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

watch(lang, () => {
  if (chartDiv.value) {
    Plotly.react(chartDiv.value, plotData.value, plotLayout.value)
  }
})
</script>