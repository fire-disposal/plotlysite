<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题和说明 -->
    <div class="hero bg-base-200 rounded-lg py-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">多维筛选分析</h1>
          <p class="py-4">
            通过多个维度对文献计量学数据进行精确筛选，深入挖掘研究模式和趋势。
          </p>
          <div class="stats stats-horizontal shadow bg-base-100">
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
      </div>
    </div>

    <!-- 快速筛选工具栏 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          快速筛选
        </h2>

        <div class="flex flex-wrap gap-2">
          <button
            class="btn btn-sm"
            :class="hasActiveFilters ? 'btn-warning' : 'btn-outline'"
            @click="clearAllFilters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            清除所有筛选
          </button>

          <button
            class="btn btn-sm btn-outline"
            @click="applyPreset('highQuality')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            高质量研究
          </button>

          <button
            class="btn btn-sm btn-outline"
            @click="applyPreset('highPerformance')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            高性能模型
          </button>

          <button
            class="btn btn-sm btn-outline"
            @click="applyPreset('openData')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            开放数据
          </button>

          <button class="btn btn-sm btn-outline" @click="applyPreset('recent')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            近期研究
          </button>
        </div>
      </div>
    </div>

    <!-- 当前筛选条件显示 -->
    <div v-if="hasActiveFilters" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          当前筛选条件
        </h3>

        <div class="flex flex-wrap gap-2">
          <!-- 网络类型标签 -->
          <div
            v-for="type in filters.networkType"
            :key="`network-${type}`"
            class="badge badge-primary gap-2"
          >
            网络: {{ type }}
            <button
              @click="removeFilter('networkType', type)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>

          <!-- 癌症类型标签 -->
          <div
            v-for="type in filters.cancerType"
            :key="`cancer-${type}`"
            class="badge badge-secondary gap-2"
          >
            癌症: {{ type }}
            <button
              @click="removeFilter('cancerType', type)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>

          <!-- 数据收集技术标签 -->
          <div
            v-for="tech in filters.dataCollectionTech"
            :key="`tech-${tech}`"
            class="badge badge-accent gap-2"
          >
            技术: {{ tech }}
            <button
              @click="removeFilter('dataCollectionTech', tech)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>

          <!-- 其他条件标签 -->
          <div
            v-if="filters.hasExternalValidation !== null"
            class="badge badge-info gap-2"
          >
            外部验证: {{ filters.hasExternalValidation ? "是" : "否" }}
            <button
              @click="removeFilter('hasExternalValidation', null)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>

          <div
            v-if="filters.hasCodeAvailability !== null"
            class="badge badge-success gap-2"
          >
            代码开放: {{ filters.hasCodeAvailability ? "是" : "否" }}
            <button
              @click="removeFilter('hasCodeAvailability', null)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>

          <div
            v-if="filters.hasDataAvailability !== null"
            class="badge badge-warning gap-2"
          >
            数据开放: {{ filters.hasDataAvailability ? "是" : "否" }}
            <button
              @click="removeFilter('hasDataAvailability', null)"
              class="btn btn-ghost btn-xs"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基础属性筛选 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            基础属性
          </h2>

          <!-- 网络类型筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">网络架构类型</span>
              <span class="label-text-alt">{{ networkTypes.length }} 种</span>
            </label>
            <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              <label
                v-for="type in networkTypes"
                :key="type"
                class="label cursor-pointer"
              >
                <span class="label-text text-sm">{{ type }}</span>
                <input
                  type="checkbox"
                  :checked="filters.networkType.includes(type)"
                  @change="toggleFilter('networkType', type)"
                  class="checkbox checkbox-primary checkbox-sm"
                />
              </label>
            </div>
          </div>

          <!-- 癌症类型筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">癌症类型</span>
              <span class="label-text-alt">{{ cancerTypes.length }} 种</span>
            </label>
            <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              <label
                v-for="type in cancerTypes"
                :key="type"
                class="label cursor-pointer"
              >
                <span class="label-text text-sm">{{ type }}</span>
                <input
                  type="checkbox"
                  :checked="filters.cancerType.includes(type)"
                  @change="toggleFilter('cancerType', type)"
                  class="checkbox checkbox-secondary checkbox-sm"
                />
              </label>
            </div>
          </div>

          <!-- 数据收集技术筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">数据收集技术</span>
              <span class="label-text-alt"
                >{{ dataCollectionTechniques.length }} 种</span
              >
            </label>
            <div class="space-y-1">
              <label
                v-for="tech in dataCollectionTechniques"
                :key="tech"
                class="label cursor-pointer"
              >
                <span class="label-text">{{ tech }}</span>
                <input
                  type="checkbox"
                  :checked="filters.dataCollectionTech.includes(tech)"
                  @change="toggleFilter('dataCollectionTech', tech)"
                  class="checkbox checkbox-accent"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能和质量筛选 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            性能和质量
          </h2>

          <!-- 性能范围筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">AUC 性能范围</span>
              <span class="label-text-alt"
                >{{ filters.performanceRange[0].toFixed(2) }} -
                {{ filters.performanceRange[1].toFixed(2) }}</span
              >
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="filters.performanceRange[1]"
              @input="updatePerformanceRange"
              class="range range-primary"
            />
            <div class="w-full flex justify-between text-xs px-2">
              <span>0.00</span>
              <span>0.50</span>
              <span>1.00</span>
            </div>
          </div>

          <!-- 质量评分范围筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">质量评分范围</span>
              <span class="label-text-alt"
                >{{ filters.qualityScoreRange[0] }} -
                {{ filters.qualityScoreRange[1] }} 分</span
              >
            </label>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              :value="filters.qualityScoreRange[1]"
              @input="updateQualityRange"
              class="range range-secondary"
            />
            <div class="w-full flex justify-between text-xs px-2">
              <span>0</span>
              <span>3</span>
              <span>7</span>
            </div>
          </div>

          <!-- 布尔属性筛选 -->
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">数据和代码可用性</span>
              </label>
              <div class="space-y-2">
                <label class="label cursor-pointer">
                  <span class="label-text">外部验证</span>
                  <div class="flex space-x-2">
                    <input
                      type="radio"
                      name="externalValidation"
                      :checked="filters.hasExternalValidation === null"
                      @change="setFilter('hasExternalValidation', null)"
                      class="radio radio-sm"
                    />
                    <span class="text-xs">全部</span>
                    <input
                      type="radio"
                      name="externalValidation"
                      :checked="filters.hasExternalValidation === true"
                      @change="setFilter('hasExternalValidation', true)"
                      class="radio radio-success radio-sm"
                    />
                    <span class="text-xs">有</span>
                    <input
                      type="radio"
                      name="externalValidation"
                      :checked="filters.hasExternalValidation === false"
                      @change="setFilter('hasExternalValidation', false)"
                      class="radio radio-error radio-sm"
                    />
                    <span class="text-xs">无</span>
                  </div>
                </label>

                <label class="label cursor-pointer">
                  <span class="label-text">代码开放</span>
                  <div class="flex space-x-2">
                    <input
                      type="radio"
                      name="codeAvailability"
                      :checked="filters.hasCodeAvailability === null"
                      @change="setFilter('hasCodeAvailability', null)"
                      class="radio radio-sm"
                    />
                    <span class="text-xs">全部</span>
                    <input
                      type="radio"
                      name="codeAvailability"
                      :checked="filters.hasCodeAvailability === true"
                      @change="setFilter('hasCodeAvailability', true)"
                      class="radio radio-success radio-sm"
                    />
                    <span class="text-xs">有</span>
                    <input
                      type="radio"
                      name="codeAvailability"
                      :checked="filters.hasCodeAvailability === false"
                      @change="setFilter('hasCodeAvailability', false)"
                      class="radio radio-error radio-sm"
                    />
                    <span class="text-xs">无</span>
                  </div>
                </label>

                <label class="label cursor-pointer">
                  <span class="label-text">数据开放</span>
                  <div class="flex space-x-2">
                    <input
                      type="radio"
                      name="dataAvailability"
                      :checked="filters.hasDataAvailability === null"
                      @change="setFilter('hasDataAvailability', null)"
                      class="radio radio-sm"
                    />
                    <span class="text-xs">全部</span>
                    <input
                      type="radio"
                      name="dataAvailability"
                      :checked="filters.hasDataAvailability === true"
                      @change="setFilter('hasDataAvailability', true)"
                      class="radio radio-success radio-sm"
                    />
                    <span class="text-xs">有</span>
                    <input
                      type="radio"
                      name="dataAvailability"
                      :checked="filters.hasDataAvailability === false"
                      @change="setFilter('hasDataAvailability', false)"
                      class="radio radio-error radio-sm"
                    />
                    <span class="text-xs">无</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选结果展示 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          筛选结果
          <div class="badge badge-primary ml-2">{{ filteredCount }} 篇</div>
        </h2>

        <div v-if="filteredCount === 0" class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span>没有符合当前筛选条件的文献。请调整筛选条件。</span>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table table-zebra table-compact">
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
                <td>
                  <div
                    class="max-w-xs truncate font-medium"
                    :title="paper.title"
                  >
                    {{ paper.title }}
                  </div>
                </td>
                <td>
                  <div class="badge badge-outline badge-sm">
                    {{ paper.network_type }}
                  </div>
                </td>
                <td class="max-w-xs truncate">{{ paper.cancer_type }}</td>
                <td>
                  <div class="flex items-center space-x-1">
                    <span class="font-mono text-sm">{{
                      parseFloat(paper.performance_auc).toFixed(3)
                    }}</span>
                    <div
                      class="badge badge-xs"
                      :class="getPerformanceClass(paper.performance_auc)"
                    ></div>
                  </div>
                </td>
                <td>
                  <div
                    class="badge badge-sm"
                    :class="`quality-score-${paper.q_score}`"
                  >
                    {{ paper.q_score }}/7
                  </div>
                </td>
                <td class="text-sm">{{ formatDate(paper.article_date) }}</td>
                <td>
                  <div class="flex space-x-1">
                    <button
                      class="btn btn-ghost btn-xs"
                      @click="viewDetails(paper)"
                      title="查看详情"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 分页 -->
          <div class="flex justify-center mt-4">
            <div class="btn-group">
              <button
                class="btn btn-sm"
                :class="{ 'btn-disabled': currentPage === 1 }"
                @click="currentPage = Math.max(1, currentPage - 1)"
              >
                «
              </button>
              <button class="btn btn-sm btn-active">
                第 {{ currentPage }} 页
              </button>
              <button
                class="btn btn-sm"
                :class="{ 'btn-disabled': currentPage === totalPages }"
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useBibliometricsStore } from "../stores/bibliometricsStore";
import { useGlobalStateStore } from "../stores/globalStateManager";

const bibliometricsStore = useBibliometricsStore();
const globalStateManager = useGlobalStateStore();

// 页面挂载时确保应用已初始化
onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp();
  }
  if (!bibliometricsStore.data.length) {
    await bibliometricsStore.loadData();
  }
});

// 响应式数据
const currentPage = ref(1);
const pageSize = 15;

// 计算属性
const totalCount = computed(() => bibliometricsStore.data.length);
const filteredCount = computed(() => bibliometricsStore.filteredData.length);
const filters = computed(() => bibliometricsStore.filters);
const networkTypes = computed(() => bibliometricsStore.availableNetworkTypes);
const cancerTypes = computed(() => bibliometricsStore.availableCancerTypes);
const dataCollectionTechniques = computed(
  () => bibliometricsStore.availableDataCollectionTechniques
);

const filterRate = computed(() => {
  return totalCount.value > 0
    ? Math.round((filteredCount.value / totalCount.value) * 100)
    : 0;
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
    f.performanceRange[1] < 1 ||
    f.qualityScoreRange[1] < 7
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredCount.value / pageSize);
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return bibliometricsStore.filteredData.slice(start, end);
});

// 方法
const toggleFilter = (filterType, value) => {
  if (filters.value[filterType].includes(value)) {
    bibliometricsStore.removeFilter(filterType, value);
  } else {
    bibliometricsStore.addFilter(filterType, value);
  }
  currentPage.value = 1;
};

const setFilter = (filterType, value) => {
  if (value === null) {
    bibliometricsStore.removeFilter(filterType, null);
  } else {
    bibliometricsStore.addFilter(filterType, value);
  }
  currentPage.value = 1;
};

const removeFilter = (filterType, value) => {
  bibliometricsStore.removeFilter(filterType, value);
  currentPage.value = 1;
};

const clearAllFilters = () => {
  bibliometricsStore.clearFilters();
  currentPage.value = 1;
};

const updatePerformanceRange = (event) => {
  const value = parseFloat(event.target.value);
  bibliometricsStore.filters.performanceRange = [0, value];
  currentPage.value = 1;
};

const updateQualityRange = (event) => {
  const value = parseInt(event.target.value);
  bibliometricsStore.filters.qualityScoreRange = [0, value];
  currentPage.value = 1;
};

const applyPreset = (presetType) => {
  clearAllFilters();

  switch (presetType) {
    case "highQuality":
      bibliometricsStore.filters.qualityScoreRange = [5, 7];
      break;
    case "highPerformance":
      bibliometricsStore.filters.performanceRange = [0.85, 1];
      break;
    case "openData":
      bibliometricsStore.addFilter("hasDataAvailability", true);
      bibliometricsStore.addFilter("hasCodeAvailability", true);
      break;
    case "recent":
      // 筛选最近2年的研究
      const recentYear = new Date().getFullYear() - 2;
      // 这里需要在 store 中实现年份筛选功能
      break;
  }
  currentPage.value = 1;
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
  // 可以打开详情模态框或跳转到其他视图
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
