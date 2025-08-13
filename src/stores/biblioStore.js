import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCSV } from '../utils/csv'
import * as Statistics from '../utils/statistics'
import _ from 'lodash'

/**
 * 字段类型定义（全局暴露，便于筛选面板动态获取）
 */
const BIBLIO_COLUMN_DEFS = {
  'Paper_ID': { required: true, type: 'string' },
  'title': { required: true, type: 'string' },
  'article_date': { required: true, type: 'string' },
  'network_type': { required: true, type: 'string', allowed: ['CNN', 'RNN', 'Transformer', 'Other'] },
  'cancer_type': { required: true, type: 'string' },
  'DataCollection_technique': { required: false, type: 'string', allowed: ['WGS', 'WES', 'RNA-seq', 'Other'] },
  'external_val_set': { required: false, type: 'string', allowed: ['1', '0', 'yes', 'no'] },
  'code_availability': { required: false, type: 'string', allowed: ['1', '0', 'yes', 'no'] },
  'raw_data_availability': { required: false, type: 'string', allowed: ['yes', 'no'] },
  'performance_auc': { required: false, type: 'number' },
  'q_score': { required: false, type: 'number', allowed: [0,1,2,3,4,5,6,7] }
};
export { BIBLIO_COLUMN_DEFS };

export const useBiblio = defineStore('biblio', () => {
  // 数据
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 新增：筛选结果及数量
  const data_f = ref([])
  const data_f_count = ref(0)

  // 统计信息
  const data_count = ref(0)
  const availableYears = ref([])
  const availableCancerTypes = ref([])
  const availableNetworkTypes = ref([])
  const updatedDate = ref('')


  // 通用统计（由外部传入数据）
  const getCategoryStats = (list, field, ...args) => {
    if (!Array.isArray(list) || !list.length) return {}
    return Statistics.categoryStats(list, field, ...args)
  }

  // 新增：筛选逻辑
  // 现在接收filters参数，由页面传入
  /**
   * 新版自由筛选算法
   * 支持：关键词模糊匹配、数值字段范围筛选、任意字段条件组合
   * 筛选条件结构示例：
   * {
   *   keywords: ['xxx', 'yyy'],
   *   numeric: [{ field: 'performance_auc', min: 0.8, max: 1 }],
   *   conditions: [{ field: 'network_type', values: ['CNN', 'RNN'] }]
   * }
   */
  const applyFilters = (f) => {
    let result = [...data.value]

    // 关键词模糊匹配
    if (f.keywords && f.keywords.length > 0) {
      const kwArr = f.keywords.map(k => k.toLowerCase())
      result = result.filter(item =>
        kwArr.some(kw =>
          Object.values(item).some(v => String(v).toLowerCase().includes(kw))
        )
      )
    }

    // 数值字段范围筛选
    if (f.numeric && Array.isArray(f.numeric)) {
      f.numeric.forEach(cond => {
        result = result.filter(item => {
          const val = parseFloat(item[cond.field])
          if (isNaN(val)) return false
          return val >= cond.min && val <= cond.max
        })
      })
    }

    // 任意字段条件组合（枚举/精确匹配）
    if (f.conditions && Array.isArray(f.conditions)) {
      f.conditions.forEach(cond => {
        result = result.filter(item => cond.values.includes(item[cond.field]))
      })
    }

    // 允许自定义扩展其他类型筛选
    // TODO: 可扩展更多类型

    // 性能优化：大数据量时可用 _.filter 或 Web Worker
    // result = _.filter(result, ...)

    data_f.value = result
    data_f_count.value = result.length
  }
  // 数据加载
  const loadData = async () => {
    loading.value = true
    error.value = null
    try {
      if (data.value.length > 0) {
        loading.value = false
        return
      }
      const csvPath = import.meta.env.BASE_URL + 'csv/bibliometrics_data.csv'
      const loadedData = await fetchCSV(csvPath)
      data.value = loadedData.map(row => {
        // 检查CSV列名与允许值
        const csvColumns = Object.keys(row)
        for (const col in BIBLIO_COLUMN_DEFS) {
          if (BIBLIO_COLUMN_DEFS[col].required && !csvColumns.includes(col)) {
            // 多语言支持
            const messages = {
              zh: `缺少必需列: ${col}`,
              en: `Missing required column: ${col}`
            }
            throw new Error(messages[import.meta.env.LOCALE || 'zh'] || messages.zh)
          }
        }
        // 检查允许值
        // 宽松化：仅校验必需列，不校验 allowed 值
        return row
      });
      // 统计信息
      data_count.value = data.value.length
      availableYears.value = [...new Set(data.value.map(i => i.article_date?.slice(0,4)).filter(Boolean))]
      availableCancerTypes.value = [...new Set(data.value.map(i => i.cancer_type).filter(Boolean))]
      availableNetworkTypes.value = [...new Set(data.value.map(i => i.network_type).filter(Boolean))]
      const dates = data.value.map(i => i.article_date).filter(Boolean).sort()
      updatedDate.value = dates.length ? dates[dates.length - 1] : ''
    } catch (err) {
      // 多语言错误处理
      const messages = {
        zh: err.message,
        en: err.message // 若后续有更多错误类型可扩展
      }
      error.value = messages[import.meta.env.LOCALE || 'zh'] || messages.zh
    } finally {
      loading.value = false
    }
  }

  // 筛选操作

  return {
    data,
    loading,
    error,
    getCategoryStats,
    loadData,
    // 新增
    data_f,
    data_count,
    applyFilters,
    // 统计信息
    totalCount: data_count,
    availableYears,
    availableCancerTypes,
    availableNetworkTypes,
    updatedDate,
    // 字段类型定义暴露
    columnDefs: BIBLIO_COLUMN_DEFS
  }
})
