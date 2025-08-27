// statistics.js - 统计分析与相关性
/**
 * 用原生 JS 替代 Lodash
 */

// 基础统计
export function basicStats(data, field) {
  const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val))
  if (values.length === 0) return { mean: 0, min: 0, max: 0, std: 0, count: 0 }
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length)
  return {
    mean: Number(mean.toFixed(3)),
    min,
    max,
    std: Number(std.toFixed(3)),
    count: values.length
  }
}

// 分组统计
export function groupStats(data, groupField, valueField) {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupField]
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
  const result = {}
  Object.entries(grouped).forEach(([group, items]) => {
    result[group] = basicStats(items, valueField)
  })
  return result
}

// 年度趋势
export function yearlyTrend(data, dateField = 'article_date', valueField = null) {
  const yearData = {}
  data.forEach(item => {
    const year = new Date(item[dateField]).getFullYear()
    if (!isNaN(year)) {
      if (!yearData[year]) yearData[year] = []
      if (valueField) {
        const value = parseFloat(item[valueField])
        if (!isNaN(value)) yearData[year].push(value)
      } else {
        yearData[year].push(item)
      }
    }
  })
  const result = {
    years: Object.keys(yearData).sort(),
    counts: {},
    averages: {}
  }
  result.years.forEach(year => {
    result.counts[year] = yearData[year].length
    if (valueField) {
      result.averages[year] = yearData[year].length > 0
        ? yearData[year].reduce((a, b) => a + b, 0) / yearData[year].length
        : 0
    }
  })
  return result
}

// 分布数据
export function distribution(data, field, bins = 10) {
  const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val))
  if (values.length === 0) return { bins: [], counts: [] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binSize = (max - min) / bins
  const binCounts = new Array(bins).fill(0)
  const binLabels = []
  for (let i = 0; i < bins; i++) {
    binLabels.push((min + i * binSize).toFixed(2))
  }
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1)
    binCounts[binIndex]++
  })
  return {
    bins: binLabels,
    counts: binCounts
  }
}

// 分类统计
export function categoryStats(data, field, splitComma = false) {
  const categoryCount = {}
  data.forEach(item => {
    const value = item[field]
    if (!value) return
    if (splitComma) {
      const categories = value.split(',').map(c => c.trim())
      categories.forEach(category => {
        if (category) categoryCount[category] = (categoryCount[category] || 0) + 1
      })
    } else {
      categoryCount[value] = (categoryCount[value] || 0) + 1
    }
  })
  const sorted = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count]) => ({ category, count }))
  return {
    categories: sorted.map(item => item.category),
    counts: sorted.map(item => item.count),
    total: sorted.reduce((sum, item) => sum + item.count, 0),
    unique: sorted.length
  }
}

// 相关性
export function correlation(data, field1, field2) {
  const pairs = data.map(item => ({
    x: parseFloat(item[field1]),
    y: parseFloat(item[field2])
  })).filter(pair => !isNaN(pair.x) && !isNaN(pair.y))
  if (pairs.length < 2) return 0
  const n = pairs.length
  const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0)
  const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0)
  const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0)
  const sumXX = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0)
  const sumYY = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0)
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
  return denominator === 0 ? 0 : numerator / denominator
}