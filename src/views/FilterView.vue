<template>
  <div class="p-6 space-y-6">
    <!-- 顶部三栏筛选区 -->
    <div class="grid gap-4 lg:grid-cols-[1.2fr_1fr_1.2fr] items-start">
      <!-- 左侧：标题和统计卡 -->
      <div class="flex flex-col justify-between bg-base-200 rounded-xl p-5 space-y-4 shadow">
        <div>
          <h1 class="text-2xl font-bold mb-2">多维筛选分析</h1>
          <p class="text-sm text-base-content/80">
            通过多个维度对文献计量学数据进行精确筛选，深入挖掘研究模式和趋势。
          </p>
        </div>
        <div class="stats stats-horizontal bg-base-100 shadow rounded-lg">
          <div class="stat">
            <div class="stat-title">原始数据</div>
            <div class="stat-value text-sm">{{ totalCount }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">筛选结果</div>
            <div class="stat-value text-sm text-primary">
              {{ filteredCount }}
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">筛选率</div>
            <div class="stat-value text-sm">{{ filterRate }}%</div>
          </div>
        </div>
      </div>

      <!-- 中间：快速筛选 -->
      <div class="bg-base-100 shadow rounded-xl p-5 flex flex-col justify-between space-y-2">
        <h2 class="card-title text-base mb-2 flex items-center">
          <BoltIcon class="h-5 w-5 mr-2" />
          快速筛选
        </h2>
        <div class="flex flex-wrap gap-2">
          <button
            class="btn btn-xs"
            :class="hasActiveFilters ? 'btn-warning' : 'btn-outline'"
            @click="clearAllFilters"
          >
            <TrashIcon class="h-4 w-4 mr-1" />
            清除所有筛选
          </button>
          <button class="btn btn-xs btn-outline" @click="applyPreset('highQuality')">
            <StarIcon class="h-4 w-4 mr-1" />
            高质量研究
          </button>
          <button class="btn btn-xs btn-outline" @click="applyPreset('highPerformance')">
            <ChartBarIcon class="h-4 w-4 mr-1" />
            高性能模型
          </button>
          <button class="btn btn-xs btn-outline" @click="applyPreset('openData')">
            <CloudArrowUpIcon class="h-4 w-4 mr-1" />
            开放数据
          </button>
          <button class="btn btn-xs btn-outline" @click="applyPreset('recent')">
            <ChartPieIcon class="h-4 w-4 mr-1" />
            近期研究
          </button>
        </div>
      </div>

      <!-- 右侧：筛选状态 -->
      <div v-if="hasActiveFilters" class="bg-base-100 shadow rounded-xl p-5 space-y-2">
        <h3 class="card-title text-sm flex items-center mb-1">
          <AdjustmentsHorizontalIcon class="h-5 w-5 mr-2" />
          当前筛选条件
        </h3>
        <div class="flex flex-wrap gap-2">
          <!-- 动态标签展示 -->
          <template v-for="type in filters.networkType" :key="`network-${type}`">
            <div class="badge badge-primary gap-2">
              网络: {{ type }}
              <button @click="removeFilter('networkType', type)" class="btn btn-ghost btn-xs">×</button>
            </div>
          </template>
          <template v-for="type in filters.cancerType" :key="`cancer-${type}`">
            <div class="badge badge-secondary gap-2">
              癌症: {{ type }}
              <button @click="removeFilter('cancerType', type)" class="btn btn-ghost btn-xs">×</button>
            </div>
          </template>
          <template v-for="tech in filters.dataCollectionTech" :key="`tech-${tech}`">
            <div class="badge badge-accent gap-2">
              技术: {{ tech }}
              <button @click="removeFilter('dataCollectionTech', tech)" class="btn btn-ghost btn-xs">×</button>
            </div>
          </template>
          <div v-if="filters.hasExternalValidation !== null" class="badge badge-info gap-2">
            外部验证: {{ filters.hasExternalValidation ? "是" : "否" }}
            <button @click="removeFilter('hasExternalValidation', null)" class="btn btn-ghost btn-xs">×</button>
          </div>
          <div v-if="filters.hasCodeAvailability !== null" class="badge badge-success gap-2">
            代码开放: {{ filters.hasCodeAvailability ? "是" : "否" }}
            <button @click="removeFilter('hasCodeAvailability', null)" class="btn btn-ghost btn-xs">×</button>
          </div>
          <div v-if="filters.hasDataAvailability !== null" class="badge badge-warning gap-2">
            数据开放: {{ filters.hasDataAvailability ? "是" : "否" }}
            <button @click="removeFilter('hasDataAvailability', null)" class="btn btn-ghost btn-xs">×</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主筛选面板 -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
      <!-- 基础属性筛选卡片 -->
      <BasicFilterPanel
        :filters="filters"
        :network-types="networkTypes"
        :cancer-types="cancerTypes"
        :data-techniques="dataCollectionTechniques"
        @toggle-filter="toggleFilter"
      />

      <!-- 性能与布尔筛选卡片 -->
      <AdvancedFilterPanel
        :filters="filters"
        @update-performance="updatePerformanceRange"
        @update-quality="updateQualityRange"
        @set-boolean="setFilter"
      />
    </div>

    <!-- 筛选结果展示区 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body space-y-4">
        <h2 class="card-title">
          <DocumentChartBarIcon class="h-6 w-6" />
          筛选结果
          <div class="badge badge-primary ml-2">{{ filteredCount }} 篇</div>
        </h2>

        <div v-if="filteredCount === 0" class="alert alert-warning">
          <ExclamationTriangleIcon class="shrink-0 h-6 w-6 text-warning" />
          <span>没有符合当前筛选条件的文献。请调整筛选条件。</span>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-base-300">
          <table class="table table-zebra table-compact text-sm">
            <thead>
              <tr>
                <th>标题</th>
                <th>网络类型</th>
                <th>癌症类型</th>
                <th>AUC</th>
                <th>质量评分</th>
                <th>发表日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paper in paginatedResults" :key="paper.Paper_ID">
                <td class="max-w-xs truncate font-medium" :title="paper.title">{{ paper.title }}</td>
                <td><div class="badge badge-outline badge-sm">{{ paper.network_type }}</div></td>
                <td class="max-w-xs truncate">{{ paper.cancer_type }}</td>
                <td>
                  <div class="flex items-center space-x-1">
                    <span class="font-mono text-sm">{{ parseFloat(paper.performance_auc).toFixed(3) }}</span>
                    <div class="badge badge-xs" :class="getPerformanceClass(paper.performance_auc)"></div>
                  </div>
                </td>
                <td>
                  <div class="badge badge-sm" :class="`quality-score-${paper.q_score}`">
                    {{ paper.q_score }}/7
                  </div>
                </td>
                <td class="text-sm">{{ formatDate(paper.article_date) }}</td>
                <td>
                  <div class="flex space-x-1">
                    <button class="btn btn-ghost btn-xs" @click="viewDetails(paper)" title="查看详情">
                      <EyeIcon class="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useBiblio } from "../stores/biblioStore";
import {
  TrashIcon,
  StarIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  ChartPieIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from "@heroicons/vue/24/outline";

const biblio = useBiblio();


onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp();
  }
  if (!bibliometricsStore.data.length) {
    await bibliometricsStore.loadData();
  }
});

const currentPage = ref(1);
const pageSize = 15;

const totalCount = computed(() => biblio.data_count);

const defaultFilters = () => ({
  search: '',
  networkType: [],
  cancerType: [],
  dataCollectionTech: [],
  hasExternalValidation: null,
  hasCodeAvailability: null,
  hasDataAvailability: null,
  performanceRange: [0, 1],
  qualityScoreRange: [0, 7]
});
const filters = ref(defaultFilters());

// 直接使用store的筛选结果
const filteredList = computed(() => biblio.data_f);
const filteredCount = computed(() => biblio.data_f_count);

// 可选项直接从原始数据生成
const networkTypes = computed(() => [...new Set(biblio.data.map(i => i.network_type).filter(Boolean))]);
const cancerTypes = computed(() => [...new Set(biblio.data.map(i => i.cancer_type).filter(Boolean))]);
const dataCollectionTechniques = computed(() => [...new Set(biblio.data.map(i => i.DataCollection_technique).filter(Boolean))]);

const filterRate = computed(() => {
  return totalCount.value > 0 ? Math.round((filteredCount.value / totalCount.value) * 100) : 0;
});

const hasActiveFilters = computed(() => {
  const f = filters.value;
  return (
    f.networkType.length > 0 ||
    f.cancerType.length > 0 ||
    f.dataCollectionTech.length > 0 ||
    f.hasExternalValidation !== null ||
    f.hasCodeAvailability !== null ||
    f.hasDataAvailability !== null ||
    f.performanceRange[0] > 0 || f.performanceRange[1] < 1 ||
    f.qualityScoreRange[0] > 0 || f.qualityScoreRange[1] < 7
  );
});

const totalPages = computed(() => Math.ceil(filteredCount.value / pageSize));
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});

/**
 * filters变化时自动应用筛选
 */
watch(filters, () => {
  biblio.applyFilters(filters.value);
  currentPage.value = 1;
}, { deep: true });

/**
 * 首次加载时也应用一次筛选
 */
onMounted(() => {
  biblio.applyFilters(filters.value);
});

const toggleFilter = (filterType, value) => {
  if (filters.value[filterType].includes(value)) {
    filters.value[filterType] = filters.value[filterType].filter(v => v !== value);
  } else {
    filters.value[filterType] = [...filters.value[filterType], value];
  }
};

const setFilter = (filterType, value) => {
  filters.value[filterType] = value;
};

const removeFilter = (filterType, value) => {
  if (Array.isArray(filters.value[filterType])) {
    filters.value[filterType] = filters.value[filterType].filter(v => v !== value);
  } else {
    filters.value[filterType] = null;
  }
};

const clearAllFilters = () => {
  filters.value = defaultFilters();
};

const updatePerformanceRange = (value) => {
  filters.value.performanceRange = [0, parseFloat(value)];
};

const updateQualityRange = (value) => {
  filters.value.qualityScoreRange = [0, parseInt(value)];
};

const applyPreset = (presetType) => {
  clearAllFilters();
  switch (presetType) {
    case "highQuality":
      filters.value.qualityScoreRange = [5, 7];
      break;
    case "highPerformance":
      filters.value.performanceRange = [0.85, 1];
      break;
    case "openData":
      filters.value.hasDataAvailability = true;
      filters.value.hasCodeAvailability = true;
      break;
    case "recent":
      // 可扩展 recent 相关逻辑
      break;
  }
};

const getPerformanceClass = (auc) => {
  const score = parseFloat(auc);
  if (score >= 0.9) return "badge-success";
  if (score >= 0.8) return "badge-info";
  if (score >= 0.7) return "badge-warning";
  return "badge-error";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
  });
};

const viewDetails = (paper) => {
  console.log("查看详情:", paper.title);
};
</script>

<style scoped>
.checkbox:checked,
.radio:checked {
  @apply border-opacity-100;
}
.range {
  @apply mb-2;
}
</style>

