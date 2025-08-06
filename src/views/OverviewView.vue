<template>
  <div class="p-6 space-y-6 min-h-[400px]">
    <template v-if="store.loading">
      <div class="flex items-center justify-center min-h-[300px]">
        <span class="text-lg text-primary">正在加载数据...</span>
      </div>
    </template>
    <template v-else-if="store.error">
      <div class="flex flex-col items-center justify-center min-h-[300px]">
        <div class="bg-white rounded-xl shadow-lg px-8 py-8 flex flex-col items-center border border-error/30 animate-fade-in" style="min-width:320px;">
          <span class="text-2xl font-bold text-error mb-2 flex items-center gap-2">
            <svg class="inline-block h-7 w-7 text-error animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            数据加载失败
          </span>
          <div class="text-base text-base-content/80 mb-2">错误信息：<span class="text-error">{{ store.error }}</span></div>
          <div class="text-sm text-base-content/70 mb-4">
            如遇持续问题，请联系研究团队邮箱：<a href="mailto:dl-bibliometrics@research.org" class="text-primary underline">dl-bibliometrics@research.org</a>
          </div>
          <button class="btn btn-error btn-sm mt-2" @click="store.loadData()">重试加载</button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="space-y-6">
        <!-- 统计区：一列展示（全局store数据） -->
        <div class="flex flex-row gap-4 w-full">
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Total papers" :value="totalCount ?? 0" icon="📄"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Total journals" :value="availableYears?.length ?? 0" icon="📚"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Authors" :value="availableCancerTypes?.length ?? 0" icon="👨‍🔬"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Countries" :value="availableNetworkTypes?.length ?? 0" icon="🌍"/>
          <StatCard class="flex-1 min-w-[140px]" title="Updated on" :value="updatedDate || ''" icon="🕒"/>
        </div>
        <!-- 图表区（全局store数据） -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartTest1 />
          <ChartTest2 />
          <ChartTest3 />
          <ChartTest4 />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBiblio } from '../stores/biblioStore'
import StatCard from '../components/StatCard.vue'

// 只引用全局store和基础统计
const store = useBiblio()
const hasData = computed(() => Array.isArray(store.data) && store.data.length > 0)
const totalCount = store.totalCount
const availableYears = store.availableYears
const availableCancerTypes = store.availableCancerTypes
const availableNetworkTypes = store.availableNetworkTypes
const updatedDate = store.updatedDate
// 页面挂载时如无数据则加载
import { watch } from 'vue'

onMounted(async () => {
  // 只在首次挂载且数据未加载时才加载，避免切换页面重复请求
  if (!hasData.value && !store.loading) {
    await store.loadData()
  }
})

// 数据加载完成后自动刷新统计区
watch(() => store.data, (val) => {
  if (val && val.length > 0) {
    // 重新赋值统计数据（computed已自动响应，无需手动赋值）
    // 可在此处做额外处理，如触发动画等
  }
})

// 图表区直接插入各自负责数据的图表组件（示例，后续补充具体组件）
import ChartTest1 from '../components/charts/charttest1.vue'
import ChartTest2 from '../components/charts/charttest2.vue'
import ChartTest3 from '../components/charts/charttest3.vue'
import ChartTest4 from '../components/charts/charttest4.vue'
</script>