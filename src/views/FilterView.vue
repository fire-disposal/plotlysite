<template>
  <v-container class="py-8" fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6 custom-card">
          <v-card-title>{{ t('filter.keyword') }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="keywords"
              :label="t('filter.inputKeyword')"
              clearable
              @keyup.enter="applyFilter"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-6 custom-card">
          <v-card-title>{{ t('filter.numeric') }}</v-card-title>
          <v-card-text>
            <v-row v-for="(num, idx) in numericFilters" :key="idx" align="center">
              <v-col cols="5">
                <v-select
                  v-model="num.field"
                  :items="numericFields"
                  :label="t('filter.field')"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model.number="num.min"
                  type="number"
                  :label="t('filter.min')"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model.number="num.max"
                  type="number"
                  :label="t('filter.max')"
                  dense
                />
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-btn icon color="error" variant="text" size="large" @click="removeNumeric(idx)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="outlined" size="small" class="mt-2" @click="addNumeric">
              {{ t('filter.addNumeric') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="custom-card">
          <v-card-title>{{ t('filter.condition') }}</v-card-title>
          <v-card-text>
            <v-row v-for="(cond, idx) in conditionFilters" :key="idx" align="center">
              <v-col cols="5">
                <v-select
                  v-model="cond.field"
                  :items="conditionFields"
                  :label="t('filter.field')"
                  dense
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cond.valuesStr"
                  :label="t('filter.matchValue')"
                  dense
                />
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-btn icon color="error" variant="text" size="large" @click="removeCondition(idx)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="outlined" size="small" class="mt-2" @click="addCondition">
              {{ t('filter.addCondition') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6" align="center">
      <v-col cols="12" md="8">
        <v-btn color="primary" @click="applyFilter">{{ t('filter.apply') }}</v-btn>
        <v-btn color="secondary" variant="outlined" class="ml-2" @click="clearAllFilters" v-if="hasActiveFilters">
          {{ t('filter.clearAll') }}
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-chip color="info" class="ma-2">{{ t('filter.result') }}：{{ filteredCount }} {{ t('filter.unit') }}</v-chip>
      </v-col>
    </v-row>

    <v-row v-if="hasActiveFilters" class="mt-4">
      <v-col cols="12">
        <v-chip color="primary" class="ma-1" v-for="kw in keywords.split(',').map(s => s.trim()).filter(Boolean)" :key="`kw-${kw}`">
          {{ t('filter.keyword') }}: {{ kw }}
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
          <v-card-title>{{ t('filter.resultTitle') }}</v-card-title>
          <v-card-text>
            <v-alert v-if="filteredCount === 0" type="warning" class="mb-4">
              <v-icon color="warning">mdi-alert</v-icon>
              {{ t('filter.noData') }}
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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const keywords = ref('')
const numericFields = ref([t('filter.fieldA'), t('filter.fieldB'), t('filter.fieldC')])
const numericFilters = ref([])
const conditionFields = ref([t('filter.condA'), t('filter.condB'), t('filter.condC')])
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
