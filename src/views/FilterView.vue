<template>
  <v-container class="py-8" fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6 custom-card">
          <v-card-title>关键词筛选</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="keywords"
              label="输入关键词（逗号分隔）"
              clearable
              @keyup.enter="applyFilter"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-6 custom-card">
          <v-card-title>数值筛选</v-card-title>
          <v-card-text>
            <v-row v-for="(num, idx) in numericFilters" :key="idx" align="center">
              <v-col cols="5">
                <v-select
                  v-model="num.field"
                  :items="numericFields"
                  label="字段"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model.number="num.min"
                  type="number"
                  label="最小值"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model.number="num.max"
                  type="number"
                  label="最大值"
                  dense
                />
              </v-col>
              <v-col cols="1">
                <v-btn icon color="error" @click="removeNumeric(idx)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="outlined" size="small" class="mt-2" @click="addNumeric">
              添加数值筛选
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="custom-card">
          <v-card-title>条件筛选</v-card-title>
          <v-card-text>
            <v-row v-for="(cond, idx) in conditionFilters" :key="idx" align="center">
              <v-col cols="5">
                <v-select
                  v-model="cond.field"
                  :items="conditionFields"
                  label="字段"
                  dense
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cond.valuesStr"
                  label="匹配值（逗号分隔）"
                  dense
                />
              </v-col>
              <v-col cols="1">
                <v-btn icon color="error" @click="removeCondition(idx)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="outlined" size="small" class="mt-2" @click="addCondition">
              添加条件筛选
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6" align="center">
      <v-col cols="12" md="8">
        <v-btn color="primary" @click="applyFilter">应用筛选</v-btn>
        <v-btn color="secondary" variant="outlined" class="ml-2" @click="clearAllFilters" v-if="hasActiveFilters">
          清除所有筛选
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-chip color="info" class="ma-2">筛选结果：{{ filteredCount }} 条</v-chip>
      </v-col>
    </v-row>

    <v-row v-if="hasActiveFilters" class="mt-4">
      <v-col cols="12">
        <v-chip color="primary" class="ma-1" v-for="kw in keywords.split(',').map(s => s.trim()).filter(Boolean)" :key="`kw-${kw}`">
          关键词: {{ kw }}
        </v-chip>
        <v-chip color="info" class="ma-1" v-for="(num, idx) in numericFilters" :key="`num-${idx}`">
          {{ num.field }}: {{ num.min }} ~ {{ num.max }}
        </v-chip>
        <v-chip color="secondary" class="ma-1" v-for="(cond, idx) in conditionFilters" :key="`cond-${idx}`">
          {{ cond.field }}: {{ cond.valuesStr }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="custom-card">
          <v-card-title>筛选结果</v-card-title>
          <v-card-text>
            <v-alert v-if="filteredCount === 0" type="warning" class="mb-4">
              <v-icon color="warning">mdi-alert</v-icon>
              没有符合当前筛选条件的数据。
            </v-alert>
            <!-- 这里可插入结果表格 -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const keywords = ref('')
const numericFields = ref(['字段A', '字段B', '字段C'])
const numericFilters = ref([])
const conditionFields = ref(['条件A', '条件B', '条件C'])
const conditionFilters = ref([])

const filteredCount = ref(0)

const hasActiveFilters = computed(() =>
  keywords.value.trim() ||
  numericFilters.value.length > 0 ||
  conditionFilters.value.length > 0
)

function addNumeric() {
  numericFilters.value.push({ field: '', min: null, max: null })
}
function removeNumeric(idx) {
  numericFilters.value.splice(idx, 1)
}
function addCondition() {
  conditionFilters.value.push({ field: '', valuesStr: '' })
}
function removeCondition(idx) {
  conditionFilters.value.splice(idx, 1)
}
function clearAllFilters() {
  keywords.value = ''
  numericFilters.value = []
  conditionFilters.value = []
}
function applyFilter() {
  // TODO: 实现筛选逻辑
  filteredCount.value = Math.floor(Math.random() * 100) // 示例
}
</script>
