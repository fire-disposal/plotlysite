<template>
  <div class="custom-card">
    <h3 class="text-lg font-bold mb-2 ml-5" style="color:var(--text-color);">{{ messages[lang]?.title }}</h3>
    <div ref="chartDiv" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Plotly from 'plotly.js-dist'

function getChartColors() {
  const theme = document.body.dataset.theme || 'light'
  return theme === 'dark'
    ? {
        pie: ['#469DEFFF', '#10b981', '#f59e42', '#e0e6ef', '#6366f1'],
        text: '#e0e6ef',
        bg: '#181818'
      }
    : {
        pie: ['#3b82f6', '#10b981', '#f59e42', '#222222', '#6366f1'],
        text: '#222222',
        bg: '#fff'
      }
}

const messages = {
  zh: {
    title: '学科分布',
    labels: ['计算机', '物理', '化学', '生物', '数学']
  },
  en: {
    title: 'Discipline Distribution',
    labels: ['Computer', 'Physics', 'Chemistry', 'Biology', 'Mathematics']
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
const values = [30, 20, 15, 25, 10]

const plotData = computed(() => [{
  values,
  labels: messages[lang.value]?.labels,
  type: 'pie',
  marker: { colors: getChartColors().pie }
}])

const plotLayout = computed(() => ({
  title: '',
  paper_bgcolor: getChartColors().bg,
  plot_bgcolor: getChartColors().bg,
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
  // 监听主题变化，自动刷新配色
  window.addEventListener('themechange', () => {
    if (chartDiv.value) {
      Plotly.react(chartDiv.value, plotData.value, plotLayout.value)
    }
  })
})

watch(lang, () => {
  if (chartDiv.value) {
    Plotly.react(chartDiv.value, plotData.value, plotLayout.value)
  }
})
</script>