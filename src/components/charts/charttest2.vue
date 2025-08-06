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
  type: 'pie'
}])

const plotLayout = computed(() => ({
  title: '',
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