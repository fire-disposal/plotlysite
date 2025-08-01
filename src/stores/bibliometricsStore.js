import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { fetchCSV } from '../utils/csv'
import {
  expandDataCollection,
  expandAugmentation,
  binDataSize,
  expandPretraining,
  cleanColumns,
  oneHotEncode,
  calcQualityScore
} from '../utils/dataProcess'
import * as Statistics from '../utils/statistics'
import * as ChartData from '../utils/chartData'
import _ from 'lodash'

export const useBibliometricsStore = defineStore('bibliometrics', () => {
  // 状态
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 扩展的筛选器状态
  const filters = ref({
    year: '',
    cancer_type: '',
    network_type: '',
    task_type: '',
    auc_min: '',
    auc_max: '',
    search: '',
    networkType: [],
    cancerType: [],
    dataCollectionTech: [],
    hasExternalValidation: null,
    hasCodeAvailability: null,
    hasDataAvailability: null,
    performanceRange: [0, 1],
    qualityScoreRange: [0, 7]
  })

  // 已移除订阅数据变化与缓存清理逻辑

  // 计算属性 - 筛选后的数据（支持高级筛选）
  const filteredData = computed(() => {
    if (!data.value.length) return []
    
    let result = [...data.value]
    const f = filters.value
    
    // 基础筛选
    if (f.search) {
      const searchTerm = f.search.toLowerCase()
      result = result.filter(item =>
        Object.values(item).some(v => _.toString(v).toLowerCase().includes(searchTerm))
      )
    }
    
    if (f.year) {
      result = result.filter(item => {
        const year = item.Year || (item.article_date ? new Date(item.article_date).getFullYear() : null)
        return year && year.toString() === f.year.toString()
      })
    }
    
    // 多选筛选
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
    
    // 布尔筛选
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
    
    // 范围筛选
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
    
    // 为结果添加质量评分
    return calcQualityScore(result)
  })

  // 统计数据 - 直接用工具函数
  // 可根据需要自定义统计属性
  const statistics = computed(() => {
    if (!data.value.length) return {}
    // 示例：返回各类统计信息
    return {
      yearStats: Statistics.categoryStats(filteredData.value, 'Year'),
      cancerStats: Statistics.categoryStats(filteredData.value, 'cancer_type', true),
      networkStats: Statistics.categoryStats(filteredData.value, 'network_type'),
      performance: Statistics.basicStats(filteredData.value, 'performance_auc')
    }
  })

  // 年份选项
  const availableYears = computed(() => {
    if (!data.value.length) return []
    const years = [...new Set(data.value.map(item => {
      return item.Year || (item.article_date ? new Date(item.article_date).getFullYear() : null)
    }).filter(year => year))].sort((a, b) => b - a)
    return years
  })

  // 癌症类型选项
  const availableCancerTypes = computed(() => {
    if (!data.value.length) return []
    const types = [...new Set(data.value.map(item => item.cancer_type).filter(type => type))].sort()
    return types
  })

  // 网络类型选项
  const availableNetworkTypes = computed(() => {
    if (!data.value.length) return []
    const types = [...new Set(data.value.map(item => item.network_type).filter(type => type))].sort()
    return types
  })

  // 任务类型选项
  const availableTaskTypes = computed(() => {
    if (!data.value.length) return []
    const types = [...new Set(data.value.map(item => item.task_type).filter(type => type))].sort()
    return types
  })

  // 数据技术选项
  const availableDataCollectionTechniques = computed(() => {
    if (!data.value.length) return []
    const techniques = [...new Set(data.value.map(item => item.DataCollection_technique).filter(tech => tech))].sort()
    return techniques
  })

  // 性能统计 - 使用统计服务或降级方案
  // 性能统计
  // 示例：性能统计
  const performanceMetrics = computed(() => {
    if (!filteredData.value.length) return {}
    return Statistics.basicStats(filteredData.value, 'performance_auc')
  })
  // 示例：数据可用性统计
  const dataAvailabilityStats = computed(() => {
    if (!filteredData.value.length) return {}
    return Statistics.categoryStats(filteredData.value, 'raw_data_availability')
  })
  // 统一设置数据
  const setData = (newData) => {
    data.value = newData
  }

  // 解析 CSV 文本为对象数组
  const parseCSVText = (csvText) => {
    try {
      // 只用 parseCSV，保证健壮
      return require('../utils/csv').parseCSV(csvText)
    } catch (err) {
      throw new Error('CSV 解析失败: ' + err.message)
    }
  }

  // 支持动态加载本地 CSV 文件
  const loadCSVFile = async (file) => {
    loading.value = true
    error.value = null
    try {
      // 只用 parseLocalCSVFile，健壮处理
      const loadedData = await require('../utils/csv').parseLocalCSVFile(file)
      setData(loadedData)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 原有加载默认数据逻辑
  const loadData = async (forceReload = false) => {
    loading.value = true
    error.value = null

    try {
      // 只加载一次或强制刷新
      if (!forceReload && data.value.length > 0) {
        loading.value = false
        return
      }
      // 控制台调试输出
      // 控制台调试输出
      const csvPath = import.meta.env.BASE_URL + 'csv/bibliometrics_data.csv'
      console.log('[bibliometricsStore] 开始加载 CSV:', csvPath)
      const loadedData = await fetchCSV(csvPath)
      console.log('[bibliometricsStore] 加载完成，记录数:', loadedData.length)
      if (loadedData.length === 0) {
        console.warn('[bibliometricsStore] 加载到的数据为空，请检查 csv 目录下 bibliometrics_data.csv 是否存在且格式正确')
      }
      // 字段映射表：左为CSV可能出现的字段，右为代码标准字段
      const FIELD_MAP = {
        'Article_Date': 'article_date',
        'Network_Type': 'network_type',
        'Classes': 'classes',
        'Task_Type': 'task_type',
        'Cancer_Type': 'cancer_type',
        'DataCollection_technique': 'DataCollection_technique',
        'Pretrained_Datatype': 'pretrained_datatype',
        'ML_Task_Description': 'ml_task_description',
        'Multiple_Cohorts': 'multiple_cohorts',
        'Demographics': 'demographics',
        'Age_Range': 'age_range',
        'Data_Origin': 'data_origin',
        'Q_Score': 'q_score',
        'Quality_Index_Param': 'quality_index_param'
      }

      // 字段标准化：将所有字段名转换为代码所需的标准字段
      function normalizeFields(row) {
        const newRow = {}
        for (const key in row) {
          // 先直接用标准字段名
          if (FIELD_MAP[key]) {
            newRow[FIELD_MAP[key]] = row[key]
          } else if (FIELD_MAP[key.trim()]) {
            newRow[FIELD_MAP[key.trim()]] = row[key]
          } else {
            // 保留原字段
            newRow[key] = row[key]
          }
        }
        return newRow
      }

      // 对所有数据行做字段名标准化
      data.value = loadedData.map(normalizeFields)

      // 首条数据预览
      if (data.value.length > 0) {
        console.log('[bibliometricsStore] 首条数据:', data.value[0])
      }
    } catch (err) {
      error.value = err.message
      console.error('加载数据失败:', err)
    } finally {
      loading.value = false
    }
  }

  const updateFilter = (key, value) => {
    filters.value[key] = value
  };

  // 新增筛选方法
  const addFilter = (filterType, value) => {
    if (Array.isArray(filters.value[filterType])) {
      if (!filters.value[filterType].includes(value)) {
        filters.value[filterType].push(value)
      }
    } else {
      filters.value[filterType] = value
    }
  }

  const removeFilter = (filterType, value) => {
    if (Array.isArray(filters.value[filterType])) {
      filters.value[filterType] = filters.value[filterType].filter(v => v !== value)
    } else {
      filters.value[filterType] = null
    }
  }

  const clearFilters = () => {
    filters.value = {
      year: '',
      cancer_type: '',
      network_type: '',
      task_type: '',
      auc_min: '',
      auc_max: '',
      search: '',
      networkType: [],
      cancerType: [],
      dataCollectionTech: [],
      hasExternalValidation: null,
      hasCodeAvailability: null,
      hasDataAvailability: null,
      performanceRange: [0, 1],
      qualityScoreRange: [0, 7]
    };
  };

  // 分页功能 - 使用新的筛选逻辑
  const getFilteredDataWithPagination = (page = 1, pageSize = 50) => {
    const all = filteredData.value
    const start = (page - 1) * pageSize
    return {
      data: all.slice(start, start + pageSize),
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords: all.length,
        totalPages: Math.ceil(all.length / pageSize),
        hasNext: start + pageSize < all.length,
        hasPrev: page > 1
      }
    }
  }

  // 获取特定记录的详细信息
  const getPaperById = (paperId) => {
    return data.value.find(item => item.Paper_ID === paperId)
  }

  // 搜索相似论文 - 使用分析服务或降级方案
  // 搜索相似论文
  const findSimilarPapers = async (targetPaper, limit = 5) => {
    if (!targetPaper) return []
    // 可自定义相似论文查找逻辑
    if (!targetPaper) return []
    // 示例：按癌症类型和网络类型简单过滤
    return filteredData.value.filter(
      item =>
        item.Paper_ID !== targetPaper.Paper_ID &&
        item.cancer_type === targetPaper.cancer_type &&
        item.network_type === targetPaper.network_type
    ).slice(0, limit)
  }
  // 导出便捷方法
  const exportFilteredData = (format = 'json') => {
    const exportData = filteredData.value
    
    if (format === 'csv') {
      // 简单的CSV导出
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'filtered_data.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      // JSON导出
      const jsonContent = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'filtered_data.json'
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  // 计算特征重要性
  const calculateFeatureImportance = async (targetField = 'performance_auc') => {
    if (!filteredData.value.length) return {}
    // 示例：返回相关性分析
    if (!filteredData.value.length) return {}
    return {
      auc: Statistics.correlation(filteredData.value, 'q_score', targetField)
    }
  }

  // 生成图表数据
  const generateChartData = async (chartType) => {
    if (!filteredData.value.length) return { data: [], layout: {} }
    // 控制台调试
    console.log('[generateChartData] chartType:', chartType, '数据量:', filteredData.value.length)
    switch (chartType) {
      case 'yearDistribution':
        // 按年份统计
        return { data: ChartData.barChart(filteredData.value, 'article_date', { title: 'Year', color: '#3b82f6' }), layout: {} }
      case 'networkTypeDistribution':
        // 网络类型词云
        return { data: ChartData.pieChart(filteredData.value, 'network_type', { title: 'Network Type', splitComma: false }), layout: {} }
      case 'classLabelDistribution':
        // 类别标签词云
        return { data: ChartData.pieChart(filteredData.value, 'classes', { title: 'Class Labels', splitComma: false }), layout: {} }
      case 'taskTypeDistribution':
        // 任务类型分布
        return { data: ChartData.barChart(filteredData.value, 'task_type', { title: 'Task Type', color: '#f59e42', splitComma: true }), layout: {} }
      case 'cancerTypeDistribution':
        // 癌症类型分布
        return { data: ChartData.barChart(filteredData.value, 'cancer_type', { title: 'Cancer Type', color: '#10b981', splitComma: true }), layout: {} }
      case 'cancerTypeTaskDistribution':
        // 癌症类型与任务类型联合分布
        return { data: ChartData.barChart(filteredData.value, 'cancer_type', { title: 'Cancer Type & Task', color: '#f43f5e', splitComma: true }), layout: {} }
      case 'mlTaskDistribution':
        // 机器学习任务分布
        return { data: ChartData.pieChart(filteredData.value, 'ml_task_description', { title: 'ML Task', splitComma: false }), layout: {} }
      case 'dataCollectionTechniqueDistribution':
        // 数据采集技术分布
        return { data: ChartData.barChart(filteredData.value, 'DataCollection_technique', { title: 'Data Collection Technique', color: '#6366f1' }), layout: {} }
      case 'pretrainedDatatypeDistribution':
        // 预训练数据类型分布
        return { data: ChartData.barChart(filteredData.value, 'pretrained_datatype', { title: 'Pretrained Datatype', color: '#f59e42' }), layout: {} }
      case 'numberOfCohortsDistribution':
        // 队列数量分布
        return { data: ChartData.histogram(filteredData.value, 'multiple_cohorts', { title: 'Number of Cohorts', color: '#3b82f6', bins: 10 }), layout: {} }
      case 'demographicsDistribution':
        // 人口统计学分布
        return { data: ChartData.barChart(filteredData.value, 'demographics', { title: 'Demographics', color: '#10b981' }), layout: {} }
      case 'ageRangeDistribution':
        // 年龄范围分布
        return { data: ChartData.barChart(filteredData.value, 'age_range', { title: 'Age Range', color: '#f43f5e' }), layout: {} }
      case 'dataOriginDistribution':
        // 数据来源分布
        return { data: ChartData.barChart(filteredData.value, 'data_origin', { title: 'Data Origin', color: '#6366f1' }), layout: {} }
      case 'qualityIndexDistribution':
        // 质量指数分布
        return { data: ChartData.histogram(filteredData.value, 'q_score', { title: 'Quality Index', color: '#f59e42', bins: 7 }), layout: {} }
      case 'qualityIndexParamDistribution':
        // 质量指数参数分布
        return { data: ChartData.barChart(filteredData.value, 'quality_index_param', { title: 'Quality Index Param', color: '#3b82f6' }), layout: {} }
      default:
        return { data: [], layout: {} }
    }
  }

  // 预热缓存
  const warmupCache = async () => {
    // 预热缓存逻辑可省略或自定义
    return
  }

  return {
    // 状态
    data,
    loading,
    error,
    filters,
    
    // 计算属性
    filteredData,
    statistics,
    availableYears,
    availableCancerTypes,
    availableNetworkTypes,
    availableTaskTypes,
    availableDataCollectionTechniques,
    performanceMetrics,
    dataAvailabilityStats,
    
    // 方法
    loadData,
    loadCSVFile,
    setData,
    parseCSVText,
    updateFilter,
    addFilter,
    removeFilter,
    clearFilters,
    getFilteredDataWithPagination,
    getPaperById,
    findSimilarPapers,
    exportFilteredData,
    calculateFeatureImportance,
    generateChartData,
    warmupCache
  }
})
