<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="hero bg-base-200 rounded-lg py-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">质量评分系统</h1>
          <p class="py-4">
            基于多维指标评估研究质量，为学术评价和研究筛选提供科学依据。
          </p>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-if="!hasData" class="alert alert-warning">
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
      <span>请先加载数据以开始质量评估</span>
    </div>

    <!-- 质量评分概览 -->
    <div v-if="hasData" class="space-y-6">
      <!-- 评分标准说明 -->
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            质量评分标准
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="criterion in qualityCriteria"
              :key="criterion.name"
              class="card bg-base-200"
            >
              <div class="card-body p-4">
                <h3 class="font-semibold text-sm">{{ criterion.name }}</h3>
                <div class="text-xs text-gray-600 mb-2">
                  {{ criterion.description }}
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs">权重:</span>
                  <div class="badge badge-primary badge-sm">
                    {{ criterion.weight }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 质量分布统计 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlotlyChart
          :data="qualityDistributionData"
          :layout="qualityDistributionLayout"
          height="350"
          title="质量评分分布"
        >
          <template #icon>
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
          </template>
        </PlotlyChart>
        <div>
          <div class="stats stats-vertical shadow">
            <div class="stat">
              <div class="stat-title">平均质量评分</div>
              <div class="stat-value text-primary">
                {{ averageQuality.toFixed(1) }}
              </div>
              <div class="stat-desc">满分 7.0 分</div>
            </div>
            <div class="stat">
              <div class="stat-title">高质量研究</div>
              <div class="stat-value text-success">{{ highQualityCount }}</div>
              <div class="stat-desc">评分 ≥ 5 分的研究</div>
            </div>
            <div class="stat">
              <div class="stat-title">优秀比例</div>
              <div class="stat-value text-info">{{ excellentRate }}%</div>
              <div class="stat-desc">评分 ≥ 6 分的比例</div>
            </div>
          </div>
          <div class="alert alert-info mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 class="font-bold">质量洞察</h3>
              <div class="text-sm">{{ qualityInsight }}</div>
            </div>
            <PlotlyChart
              :data="qualityDimensionData"
              :layout="qualityDimensionLayout"
              height="400"
              title="各维度质量表现"
            >
              <template #icon>
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </template>
            </PlotlyChart>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlotlyChart
                :data="qualityPerformanceData"
                :layout="qualityPerformanceLayout"
                height="350"
                title="质量 vs 性能关系"
              >
                <template #icon>
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
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </template>
              </PlotlyChart>
              <PlotlyChart
                :data="qualityTimeData"
                :layout="qualityTimeLayout"
                height="350"
                title="质量随时间变化"
              >
                <template #icon>
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </template>
              </PlotlyChart>
            </div>
            <!-- 高质量研究列表 -->
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  高质量研究推荐
                  <div class="badge badge-success ml-2">
                    Top {{ topQualityPapers.length }}
                  </div>
                </h2>

                <div class="overflow-x-auto">
                  <table class="table table-zebra">
                    <thead>
                      <tr>
                        <th>排名</th>
                        <th>标题</th>
                        <th>质量评分</th>
                        <th>各维度得分</th>
                        <th>AUC</th>
                        <th>发表年份</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(paper, index) in topQualityPapers"
                        :key="paper.Paper_ID"
                      >
                        <td>
                          <div class="flex items-center space-x-2">
                            <div class="badge badge-primary">
                              {{ index + 1 }}
                            </div>
                            <svg
                              v-if="index < 3"
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                              />
                            </svg>
                          </div>
                        </td>
                        <td>
                          <div
                            class="max-w-xs truncate font-medium"
                            :title="paper.title"
                          >
                            {{ paper.title }}
                          </div>
                        </td>
                        <td>
                          <div class="flex items-center space-x-2">
                            <div
                              class="badge"
                              :class="`quality-score-${paper.q_score}`"
                            >
                              {{ paper.q_score }}/7
                            </div>
                            <div
                              class="radial-progress text-xs"
                              :style="`--value:${(
                                (paper.q_score / 7) *
                                100
                              ).toFixed(0)}`"
                            >
                              {{ ((paper.q_score / 7) * 100).toFixed(0) }}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="text-xs space-y-1">
                            <div class="flex justify-between">
                              <span>数据:</span>
                              <span
                                :class="
                                  paper.raw_data_availability === 'yes'
                                    ? 'text-success'
                                    : 'text-error'
                                "
                              >
                                {{
                                  paper.raw_data_availability === "yes"
                                    ? "✓"
                                    : "✗"
                                }}
                              </span>
                            </div>
                            <div class="flex justify-between">
                              <span>代码:</span>
                              <span
                                :class="
                                  paper.code_availability === 'yes'
                                    ? 'text-success'
                                    : 'text-error'
                                "
                              >
                                {{
                                  paper.code_availability === "yes" ? "✓" : "✗"
                                }}
                              </span>
                            </div>
                            <div class="flex justify-between">
                              <span>验证:</span>
                              <span
                                :class="
                                  hasExternalValidation(paper)
                                    ? 'text-success'
                                    : 'text-error'
                                "
                              >
                                {{ hasExternalValidation(paper) ? "✓" : "✗" }}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="font-mono">{{
                            parseFloat(paper.performance_auc).toFixed(3)
                          }}</span>
                        </td>
                        <td>
                          {{ new Date(paper.article_date).getFullYear() }}
                        </td>
                        <td>
                          <div class="flex space-x-1">
                            <button
                              class="btn btn-ghost btn-xs"
                              @click="analyzePaper(paper)"
                              title="详细分析"
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
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </button>
                            <button
                              class="btn btn-ghost btn-xs"
                              @click="findSimilarHighQuality(paper)"
                              title="找相似高质量研究"
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
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 质量改进建议 -->
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  质量改进建议
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="alert alert-warning">
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
                    <div>
                      <h3 class="font-bold">主要问题</h3>
                      <div class="text-sm">{{ mainIssue }}</div>
                    </div>
                  </div>

                  <div class="alert alert-success">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 class="font-bold">改进建议</h3>
                      <div class="text-sm">{{ improvementSuggestion }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <h3 class="font-semibold mb-2">具体改进措施：</h3>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li
                      v-for="suggestion in detailedSuggestions"
                      :key="suggestion"
                    >
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBibliometricsStore } from "../stores/bibliometricsStore";
import { useGlobalStateStore } from "../stores/globalStateManager";
import PlotlyChart from "../components/PlotlyChart.vue";

const router = useRouter();

const bibliometricsStore = useBibliometricsStore();
const globalStateManager = useGlobalStateStore();

// 页面挂载时确保应用已初始化
onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp()
  }
})

// 基础数据
const hasData = computed(() => bibliometricsStore.data.length > 0);
const filteredData = computed(() => bibliometricsStore.filteredData);
const qualityStats = computed(() => bibliometricsStore.dataAvailabilityStats);

// 质量标准配置
const qualityCriteria = [
  { name: "数据可用性", description: "原始数据是否公开可获得", weight: "1.0" },
  { name: "代码可用性", description: "实现代码是否开源", weight: "1.0" },
  { name: "方法学完整性", description: "方法描述的详细程度", weight: "1.0" },
  { name: "性能指标", description: "报告的性能指标数量", weight: "1.0" },
  { name: "外部验证", description: "是否进行外部验证", weight: "1.0" },
  { name: "基准测试", description: "是否与其他方法对比", weight: "1.0" },
  { name: "实现细节", description: "技术实现细节完整性", weight: "1.0" },
];

// 质量统计 - 使用store中的统计数据
const averageQuality = computed(() => qualityStats.value.averageScore || 0);
const highQualityCount = computed(() => qualityStats.value.highQuality?.count || 0);
const excellentRate = computed(() => qualityStats.value.excellent?.percentage || 0);

const qualityInsight = computed(() => {
  const avgScore = averageQuality.value;
  if (avgScore >= 5) {
    return "整体研究质量较高，大部分研究达到了良好的标准，具有较强的可重现性和可信度。";
  } else if (avgScore >= 3) {
    return "研究质量中等，仍有提升空间，特别是在数据开放性和方法学完整性方面。";
  } else {
    return "研究质量有待提高，建议加强数据和代码的开放性，完善方法学描述。";
  }
});

const topQualityPapers = computed(() => {
  return filteredData.value
    .filter((paper) => !isNaN(parseFloat(paper.performance_auc)))
    .sort((a, b) => {
      const scoreA = a.q_score || 0;
      const scoreB = b.q_score || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return parseFloat(b.performance_auc) - parseFloat(a.performance_auc);
    })
    .slice(0, 15);
});

// 问题分析 - 使用统计数据
const mainIssue = computed(() => {
  const stats = qualityStats.value;
  const dataOpenRate = stats.rawDataAvailable?.percentage || 0;
  const codeOpenRate = stats.codeAvailable?.percentage || 0;
  const validationRate = stats.externalValidation?.percentage || 0;

  if (dataOpenRate < 30) {
    return `数据开放性不足是影响研究质量的主要问题，仅有 ${dataOpenRate}% 的研究提供了开放数据。`;
  } else if (codeOpenRate < 30) {
    return `代码开放性不足，仅有 ${codeOpenRate}% 的研究开放了实现代码。`;
  } else if (validationRate < 40) {
    return `外部验证不充分，仅有 ${validationRate}% 的研究进行了外部验证。`;
  } else {
    return "整体质量良好，但仍可在方法学描述和基准测试方面进一步改进。";
  }
});

const improvementSuggestion = computed(() => {
  return "建议研究者在论文发表时同时开放数据和代码，详细描述方法学细节，并进行充分的外部验证和基准测试。";
});

const detailedSuggestions = computed(() => [
  "制定数据管理计划，确保研究数据的可获得性和可重用性",
  "使用版本控制系统管理代码，并在公开平台分享",
  "详细描述模型架构、训练过程和参数设置",
  "报告多个性能指标，包括敏感性、特异性、AUC等",
  "在多个独立数据集上验证模型性能",
  "与已发表的方法进行公平的基准测试对比",
  "提供充分的实现细节以支持结果重现",
]);

// 图表数据 - 使用统一的图表服务
const qualityDistributionChart = computed(() =>
  bibliometricsStore.generateChartData('qualityDistribution')
);
const qualityDistributionData = computed(() => qualityDistributionChart.value.data);
const qualityDistributionLayout = computed(() => qualityDistributionChart.value.layout);

const qualityVsPerformanceChart = computed(() =>
  bibliometricsStore.generateChartData('qualityVsPerformance')
);
const qualityPerformanceData = computed(() => qualityVsPerformanceChart.value.data);
const qualityPerformanceLayout = computed(() => qualityVsPerformanceChart.value.layout);

// 质量维度雷达图数据 - 简化处理
const qualityDimensionData = computed(() => {
  const stats = qualityStats.value;
  const dimensions = [
    { name: "数据开放", value: stats.rawDataAvailable?.percentage || 0 },
    { name: "代码开放", value: stats.codeAvailable?.percentage || 0 },
    { name: "外部验证", value: stats.externalValidation?.percentage || 0 },
    { name: "多队列研究", value: stats.multipleCohorts?.percentage || 0 }
  ];

  return [
    {
      r: dimensions.map(d => d.value),
      theta: dimensions.map(d => d.name),
      type: "scatterpolar",
      fill: "toself",
      marker: { color: "#3b82f6" },
      name: "达标率 (%)",
    },
  ];
});

const qualityDimensionLayout = computed(() => ({
  title: "",
  polar: {
    radialaxis: {
      visible: true,
      range: [0, 100],
      ticksuffix: "%",
    },
  },
  margin: { t: 20, r: 20, b: 20, l: 20 },
}));

// 质量时间趋势 - 简化处理
const qualityTimeData = computed(() => {
  const yearQuality = {};

  filteredData.value.forEach((paper) => {
    const year = new Date(paper.article_date).getFullYear();
    if (!isNaN(year)) {
      if (!yearQuality[year]) {
        yearQuality[year] = [];
      }
      yearQuality[year].push(paper.q_score || 0);
    }
  });

  const years = Object.keys(yearQuality).sort();
  const avgQuality = years.map((year) => {
    const scores = yearQuality[year];
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });

  return [
    {
      x: years,
      y: avgQuality,
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#10b981", width: 3 },
      marker: { size: 8 },
      name: "平均质量评分",
    },
  ];
});

const qualityTimeLayout = computed(() => ({
  title: "",
  xaxis: { title: "年份" },
  yaxis: { title: "平均质量评分" },
  margin: { t: 20, r: 20, b: 40, l: 40 },
}));

// 工具方法
const hasExternalValidation = (paper) => {
  return paper.external_val_set === 1 || paper.multiple_cohorts === 1;
};

const analyzePaper = (paper) => {
  // 这里可以实现论文详细分析功能
  console.log('分析论文:', paper.title);
};

const findSimilarHighQuality = (paper) => {
  // 使用store中的相似论文查找功能
  const similarPapers = bibliometricsStore.findSimilarPapers(paper, 5);
  console.log('相似高质量论文:', similarPapers);
  router.push("/similarity");
};
</script>
