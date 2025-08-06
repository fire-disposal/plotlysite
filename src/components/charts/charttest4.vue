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
    title: '身高体重分布',
    x: '身高 (cm)',
    y: '体重 (kg)'
  },
  en: {
    title: 'Height vs Weight Distribution',
    x: 'Height (cm)',
    y: 'Weight (kg)'
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
const heights = [160, 165, 170, 175, 180, 185]
const weights = [50, 60, 65, 70, 80, 85]

const plotData = computed(() => [{
  x: heights,
  y: weights,
  mode: 'markers',
  type: 'scatter',
  marker: { size: 12, color: '#10b981' }
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