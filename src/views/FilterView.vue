<template>
  <div class="flex flex-col gap-8 p-6">
    <!-- 顶部统计卡片区 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl shadow p-5 flex flex-col items-center">
        <div class="text-lg font-bold mb-2">原始数据</div>
        <div class="text-3xl font-mono text-primary">{{ totalCount }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-5 flex flex-col items-center">
        <div class="text-lg font-bold mb-2">筛选结果</div>
        <div class="text-3xl font-mono text-success">{{ filteredCount }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-5 flex flex-col items-center">
        <div class="text-lg font-bold mb-2">筛选率</div>
        <div class="text-3xl font-mono text-info">{{ filterRate }}%</div>
      </div>
    </div>

    <!-- 筛选入口区 -->
    <div class="flex flex-wrap gap-4 items-center">
      <div class="flex gap-2">
        <button
          v-for="preset in presets"
          :key="preset.key"
          class="btn btn-sm"
          :class="activePreset === preset.key ? 'btn-primary' : 'btn-outline'"
          @click="applyPreset(preset.key)"
        >
          <span class="mr-1">{{ preset.icon }}</span>{{ preset.label }}
        </button>
      </div>
      <button class="btn btn-sm btn-warning" v-if="hasActiveFilters" @click="clearAllFilters">
        清除所有筛选
      </button>
    </div>

    <!-- 筛选面板 -->
    <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 关键词筛选 -->
        <div>
          <div class="font-bold mb-2">关键词</div>
          <input
            v-model="keywordsInput"
            class="input input-bordered w-full"
            placeholder="输入关键词，逗号分隔"
            @keyup.enter="applyFilter"
          />
        </div>
        <!-- 数值筛选 -->
        <div>
          <div class="font-bold mb-2">数值字段</div>
          <div v-for="(num, idx) in numericFilters" :key="idx" class="flex gap-2 mb-2">
            <select v-model="num.field" class="select select-bordered w-28">
              <option v-for="field in numericFields" :key="field" :value="field">{{ field }}</option>
            </select>
            <input v-model.number="num.min" type="number" class="input input-bordered w-16" placeholder="最小值" />
            <input v-model.number="num.max" type="number" class="input input-bordered w-16" placeholder="最大值" />
            <button class="btn btn-xs btn-error" @click="removeNumeric(idx)">删除</button>
          </div>
          <button class="btn btn-xs btn-outline" @click="addNumeric">添加数值筛选</button>
        </div>
        <!-- 条件筛选 -->
        <div>
          <div class="font-bold mb-2">条件字段</div>
          <div v-for="(cond, idx) in conditionFilters" :key="idx" class="flex gap-2 mb-2">
            <select v-model="cond.field" class="select select-bordered w-28">
              <option v-for="field in conditionFields" :key="field" :value="field">{{ field }}</option>
            </select>
            <input v-model="cond.valuesStr" class="input input-bordered w-28" placeholder="匹配值，逗号分隔" />
            <button class="btn btn-xs btn-error" @click="removeCondition(idx)">删除</button>
          </div>
          <button class="btn btn-xs btn-outline" @click="addCondition">添加条件筛选</button>
        </div>
      </div>
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="applyFilter">应用筛选</button>
      </div>
    </div>

    <!-- 当前筛选状态标签区 -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span
        v-for="kw in keywordsInput.split(',').map(s => s.trim()).filter(Boolean)"
        :key="`kw-${kw}`"
        class="badge badge-primary gap-2"
      >
        关键词: {{ kw }}
      </span>
      <span
        v-for="(num, idx) in numericFilters"
        :key="`num-${idx}`"
        class="badge badge-info gap-2"
      >
        {{ num.field }}: {{ num.min }} ~ {{ num.max }}
      </span>
      <span
        v-for="(cond, idx) in conditionFilters"
        :key="`cond-${idx}`"
        class="badge badge-secondary gap-2"
      >
        {{ cond.field }}: {{ cond.valuesStr }}
      </span>
    </div>

    <!-- 结果表格区 -->
    <div class="bg-base-100 rounded-xl shadow-xl p-6">
      <div class="flex items-center mb-4">
        <span class="card-title text-lg">筛选结果</span>
        <span class="badge badge-primary ml-2">{{ filteredCount }} 篇</span>
      </div>
      <div v-if="filteredCount === 0" class="alert alert-warning flex items-center gap-2">
        <span class="material-icons text-warning">warning</span>
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
              <td><span class="badge badge-outline badge-sm">{{ paper.network_type }}</span></td>
              <td class="max-w-xs truncate">{{ paper.cancer_type }}</td>
              <td>
                <span class="font-mono text-sm">{{ parseFloat(paper.performance_auc).toFixed(3) }}</span>
              </td>
              <td>
                <span class="badge badge-sm" :class="`quality-score-${paper.q_score}`">{{ paper.q_score }}/7</span>
              </td>
              <td class="text-sm">{{ formatDate(paper.article_date) }}</td>
              <td>
                <button class="btn btn-ghost btn-xs" @click="viewDetails(paper)" title="查看详情">
                  <span class="material-icons text-base">visibility</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 分页控件 -->
        <div class="flex justify-end items-center mt-4 gap-2" v-if="totalPages > 1">
          <button class="btn btn-xs btn-outline" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
          <span class="mx-2 text-sm">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn btn-xs btn-outline" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBiblio } from "../stores/biblioStore";
import { BIBLIO_COLUMN_DEFS } from "../stores/biblioStore";

// 预设筛选项
const presets = [
  { key: "highQuality", label: "高质量研究", icon: "⭐" },
  { key: "highPerformance", label: "高性能模型", icon: "📈" },
  { key: "openData", label: "开放数据", icon: "☁️" },
  { key: "recent", label: "近期研究", icon: "🕒" },
];

const activePreset = ref(null);

const biblio = useBiblio();

const currentPage = ref(1);
const pageSize = 15;

const totalCount = computed(() => biblio.data_count);
const filteredCount = computed(() => biblio.data_f_count);

const keywordsInput = ref("");
const numericFilters = ref([]);
const conditionFilters = ref([]);

// 字段列表
const columnDefs = computed(() => biblio.columnDefs || BIBLIO_COLUMN_DEFS);
const numericFields = computed(() =>
  Object.entries(columnDefs.value)
    .filter(([k, v]) => v.type === "number")
    .map(([k]) => k)
);
const conditionFields = computed(() =>
  Object.entries(columnDefs.value)
    .filter(([k, v]) => Array.isArray(v.allowed) && v.type !== "number")
    .map(([k]) => k)
);

// 数值筛选操作
const addNumeric = () => {
  numericFilters.value.push({ field: numericFields.value[0], min: 0, max: 1 });
};
const removeNumeric = (idx) => {
  numericFilters.value.splice(idx, 1);
};

// 条件筛选操作
const addCondition = () => {
  conditionFilters.value.push({ field: conditionFields.value[0], valuesStr: "" });
};
const removeCondition = (idx) => {
  conditionFilters.value.splice(idx, 1);
};

// 应用筛选
const applyFilter = () => {
  const keywords = keywordsInput.value.split(",").map((s) => s.trim()).filter(Boolean);
  const numeric = numericFilters.value.map((f) => ({
    field: f.field,
    min: f.min,
    max: f.max,
  }));
  const conditions = conditionFilters.value.map((f) => ({
    field: f.field,
    values: f.valuesStr.split(",").map((s) => s.trim()).filter(Boolean),
  }));
  biblio.applyFilters({ keywords, numeric, conditions });
  activePreset.value = null;
  currentPage.value = 1;
};

// 预设筛选
const applyPreset = (type) => {
  activePreset.value = type;
  let preset = { keywords: [], numeric: [], conditions: [] };
  switch (type) {
    case "highQuality":
      preset.numeric.push({ field: "q_score", min: 6, max: 7 });
      break;
    case "highPerformance":
      preset.numeric.push({ field: "performance_auc", min: 0.85, max: 1 });
      break;
    case "openData":
      preset.conditions.push({ field: "raw_data_availability", values: ["Yes", "Available", "开放"] });
      break;
    case "recent":
      const recentYear = new Date().getFullYear() - 2;
      preset.keywords.push(String(recentYear), String(recentYear + 1), String(recentYear + 2));
      break;
    default:
      break;
  }
  biblio.applyFilters(preset);
  keywordsInput.value = preset.keywords.join(",");
  numericFilters.value = preset.numeric.map((n) => ({ ...n }));
  conditionFilters.value = preset.conditions.map((c) => ({
    field: c.field,
    valuesStr: c.values.join(","),
  }));
  currentPage.value = 1;
};

// 清除所有筛选
const clearAllFilters = () => {
  keywordsInput.value = "";
  numericFilters.value = [];
  conditionFilters.value = [];
  activePreset.value = null;
  applyFilter();
};

// 筛选状态
const hasActiveFilters = computed(() => {
  return (
    (keywordsInput.value && keywordsInput.value.trim() !== "") ||
    numericFilters.value.length > 0 ||
    conditionFilters.value.some((c) => c.valuesStr && c.valuesStr.trim() !== "")
  );
});

// 分页
const totalPages = computed(() => Math.ceil(filteredCount.value / pageSize));
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return biblio.data_f.slice(start, start + pageSize);
});

// 日期格式化
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
  });
};

// 查看详情
const viewDetails = (paper) => {
  // 可扩展为弹窗预览等
  alert(`查看详情: ${paper.title}`);
};

onMounted(() => {
  applyFilter();
});
</script>

<style scoped>
.badge-primary {
  background: #2563eb;
  color: #fff;
}
.badge-info {
  background: #06b6d4;
  color: #fff;
}
.badge-secondary {
  background: #64748b;
  color: #fff;
}
.badge-success {
  background: #22c55e;
  color: #fff;
}
.badge-warning {
  background: #f59e42;
  color: #fff;
}
.badge-error {
  background: #ef4444;
  color: #fff;
}
.quality-score-7 { background: #22c55e; color: #fff; }
.quality-score-6 { background: #a3e635; color: #fff; }
.quality-score-5 { background: #facc15; color: #fff; }
.quality-score-4 { background: #f59e42; color: #fff; }
.quality-score-3 { background: #f87171; color: #fff; }
.quality-score-2 { background: #ef4444; color: #fff; }
.quality-score-1 { background: #991b1b; color: #fff; }
</style>
