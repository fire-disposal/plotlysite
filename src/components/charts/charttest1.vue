<template>
  <div>
    <h3 class="text-lg font-bold mb-2">{{ messages[lang]?.title }}</h3>
    <div ref="chartDiv" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBiblio } from '../../stores/biblioStore'
import Plotly from 'plotly.js-dist'

const messages = {
  zh: {
    title: '年度发表趋势',
    x: '年份',
    y: '论文数量'
  },
  en: {
    title: 'Annual Publication Trend',
    x: 'Year',
    y: 'Paper Count'
  }
}

const lang = ref(localStorage.getItem('lang') || 'zh')

// 监听 storage 事件（跨 tab）和自定义 langchange 事件（本 tab）
const updateLang = () => {
  lang.value = localStorage.getItem('lang') || 'zh'
}
window.addEventListener('storage', updateLang)
window.addEventListener('langchange', updateLang)

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

// 监听全局语言切换
watch(
  () => localStorage.getItem('lang'),
  (val) => {
    if (val && locale.value !== val) locale.value = val
  }
)
watch(lang, () => {
  if (chartDiv.value) {
    Plotly.react(chartDiv.value, plotData.value, plotLayout.value)
  }
})
</script>