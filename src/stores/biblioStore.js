import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCSV } from '../utils/csv'
import * as Statistics from '../utils/statistics'
import _ from 'lodash'

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
  const applyFilters = (f) => {
    let result = [...data.value]
    if (f.search) {
      const searchTerm = f.search.toLowerCase()
      result = result.filter(item =>
        Object.values(item).some(v => String(v).toLowerCase().includes(searchTerm))
      )
    }
    if (f.networkType.length > 0) {
      result = result.filter(item => f.networkType.includes(item.network_type))
    }
    if (f.cancerType.length > 0) {
      result = result.filter(item => {
        if (!item.cancer_type) return false
        const itemCancers = item.cancer_type.split(',').map(c => c.trim())
        return f.cancerType.some(filterCancer =>
          itemCancers.some(itemCancer => itemCancer.includes(filterCancer))
        )
      })
    }
    if (f.dataCollectionTech.length > 0) {
      result = result.filter(item => f.dataCollectionTech.includes(item.DataCollection_technique))
    }
    if (f.hasExternalValidation !== null) {
      result = result.filter(item => {
        const hasExternal = item.external_val_set === '1' || item.external_val_set === 'yes'
        return hasExternal === f.hasExternalValidation
      })
    }
    if (f.hasCodeAvailability !== null) {
      result = result.filter(item => {
        const hasCode = item.code_availability === '1' || item.code_availability === 'yes'
        return hasCode === f.hasCodeAvailability
      })
    }
    if (f.hasDataAvailability !== null) {
      result = result.filter(item => {
        const hasData = item.raw_data_availability === 'yes'
        return hasData === f.hasDataAvailability
      })
    }
    if (f.performanceRange[1] < 1) {
      result = result.filter(item => {
        const auc = parseFloat(item.performance_auc) || 0
        return auc >= f.performanceRange[0] && auc <= f.performanceRange[1]
      })
    }
    if (f.qualityScoreRange[1] < 7) {
      result = result.filter(item => {
        const score = item.q_score || 0
        return score >= f.qualityScoreRange[0] && score <= f.qualityScoreRange[1]
      })
    }
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
        const COLUMN_DEFS = {
          'Paper_ID': { required: true },
          'title': { required: true },
          'article_date': { required: true, type: 'string' },
          'network_type': { required: true, allowed: ['CNN', 'RNN', 'Transformer', 'Other'] },
          'cancer_type': { required: true },
          'DataCollection_technique': { required: false, allowed: ['WGS', 'WES', 'RNA-seq', 'Other'] },
          'external_val_set': { required: false, allowed: ['1', '0', 'yes', 'no'] },
          'code_availability': { required: false, allowed: ['1', '0', 'yes', 'no'] },
          'raw_data_availability': { required: false, allowed: ['yes', 'no'] },
          'performance_auc': { required: false, type: 'number' },
          'q_score': { required: false, type: 'number', allowed: [0,1,2,3,4,5,6,7] }
        }
        // 检查列名
        const csvColumns = Object.keys(row)
        for (const col in COLUMN_DEFS) {
          if (COLUMN_DEFS[col].required && !csvColumns.includes(col)) {
            throw new Error(`缺少必需列: ${col}`)
          }
        }
        // 检查允许值
        // 宽松化：仅校验必需列，不校验 allowed 值
        return row
      })
      // 统计信息
      data_count.value = data.value.length
      availableYears.value = [...new Set(data.value.map(i => i.article_date?.slice(0,4)).filter(Boolean))]
      availableCancerTypes.value = [...new Set(data.value.map(i => i.cancer_type).filter(Boolean))]
      availableNetworkTypes.value = [...new Set(data.value.map(i => i.network_type).filter(Boolean))]
      const dates = data.value.map(i => i.article_date).filter(Boolean).sort()
      updatedDate.value = dates.length ? dates[dates.length - 1] : ''
    } catch (err) {
      error.value = err.message
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
    updatedDate
  }
})
