<template>
  <div class="bg-base-100 border border-base-300 p-6 rounded-lg relative min-h-[400px]">
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="ml-3 text-lg text-primary">正在加载图表数据...</span>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-[400px] text-error text-lg">
      图表加载失败：{{ error }}
    </div>
    <div v-else-if="!hasData" class="flex items-center justify-center min-h-[400px] text-base-content/60 text-lg">
      暂无可视化数据
    </div>
    <div v-else>
      <div v-if="title" class="flex items-center gap-2 text-xl font-semibold mb-4">
        <slot name="icon"></slot>
        <span>{{ title }}</span>
      </div>
      <div :id="chartId" ref="chartContainer" class="w-full h-full min-h-[400px] rounded-lg"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import Plotly from 'plotly.js-dist'

const props = defineProps({
  data: { type: Array, required: true, default: () => [] },
  layout: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d']
  }) },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: [String, Object], default: null }
})

const chartContainer = ref(null)
const chartId = `smart-plot-${Math.random().toString(36).substr(2, 9)}`
const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0)

let plotInstance = null

const renderPlot = async () => {
  if (!chartContainer.value || !hasData.value) return
  await nextTick()
  try {
    plotInstance = await Plotly.newPlot(
      chartContainer.value,
      props.data,
      props.layout,
      props.config
    )
  } catch (e) {
    console.error('SmartPlot 渲染失败:', e)
  }
}

watch(
  () => [props.data, props.layout, props.loading, props.error],
  async () => {
    if (props.loading || props.error) return
    if (!hasData.value) {
      if (plotInstance && chartContainer.value) Plotly.purge(chartContainer.value)
      return
    }
    await renderPlot()
  },
  { deep: true, immediate: true }
)

onMounted(renderPlot)
</script>

<style scoped>
.loading {
  font-size: 1.5rem;
}
</style>