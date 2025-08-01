// chartData.js - 图表数据生成
import _ from 'lodash'
import * as Statistics from './statistics'

// 柱状图
export function barChart(data, field, { title = '', color = '#3b82f6', splitComma = false, limit = null } = {}) {
  const stats = Statistics.categoryStats(data, field, splitComma)
  let categories = stats.categories
  let counts = stats.counts
  if (limit && limit > 0) {
    categories = categories.slice(0, limit)
    counts = counts.slice(0, limit)
  }
  return [{
    x: categories,
    y: counts,
    type: 'bar',
    marker: { color },
    name: title || field
  }]
}

// 饼图
export function pieChart(data, field, { title = '', splitComma = false, limit = null } = {}) {
  const stats = Statistics.categoryStats(data, field, splitComma)
  let categories = stats.categories
  let counts = stats.counts
  if (limit && limit > 0) {
    categories = categories.slice(0, limit)
    counts = counts.slice(0, limit)
  }
  return [{
    values: counts,
    labels: categories,
    type: 'pie',
    name: title || field
  }]
}

// 直方图
export function histogram(data, field, { title = '', color = '#3b82f6', bins = 20 } = {}) {
  const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val))
  return [{
    x: values,
    type: 'histogram',
    marker: { color },
    nbinsx: bins,
    name: title || field
  }]
}

// 散点图
export function scatter(data, xField, yField, { title = '', color = '#3b82f6', colorField = null, sizeField = null, textField = null } = {}) {
  const validData = data.filter(item => !isNaN(parseFloat(item[xField])) && !isNaN(parseFloat(item[yField])))
  const plotData = {
    x: validData.map(item => parseFloat(item[xField])),
    y: validData.map(item => parseFloat(item[yField])),
    type: 'scatter',
    mode: 'markers',
    name: title
  }
  if (colorField) {
    plotData.marker = {
      color: validData.map(item => parseFloat(item[colorField]) || 0),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: colorField }
    }
  } else {
    plotData.marker = { color }
  }
  if (sizeField) {
    const sizes = validData.map(item => {
      const size = parseFloat(item[sizeField]) || 1
      return Math.max(5, Math.min(20, size * 2))
    })
    plotData.marker = { ...plotData.marker, size: sizes }
  }
  if (textField) {
    plotData.text = validData.map(item => item[textField])
    plotData.hovertemplate = `${xField}: %{x}<br>${yField}: %{y}<br>%{text}<extra></extra>`
  }
  return [plotData]
}

// 折线图
export function lineChart(data, xField, yField, { title = '', color = '#3b82f6', mode = 'lines+markers', groupBy = null } = {}) {
  if (groupBy) {
    const grouped = _.groupBy(data, groupBy)
    return Object.entries(grouped).map(([group, items]) => {
      const sortedItems = _.sortBy(items, xField)
      return {
        x: sortedItems.map(item => item[xField]),
        y: sortedItems.map(item => parseFloat(item[yField]) || 0),
        type: 'scatter',
        mode,
        name: group,
        line: { width: 3 },
        marker: { size: 8 }
      }
    })
  } else {
    const sortedData = _.sortBy(data, xField)
    return [{
      x: sortedData.map(item => item[xField]),
      y: sortedData.map(item => parseFloat(item[yField]) || 0),
      type: 'scatter',
      mode,
      line: { color, width: 3 },
      marker: { size: 8 },
      name: title
    }]
  }
}

// 箱型图
export function boxPlot(data, yField, groupField, { title = '', showPoints = 'outliers' } = {}) {
  const grouped = _.groupBy(data, groupField)
  return Object.entries(grouped).map(([group, items]) => {
    const values = items.map(item => parseFloat(item[yField])).filter(val => !isNaN(val))
    return {
      y: values,
      type: 'box',
      name: group,
      boxpoints: showPoints
    }
  })
}

// 年度趋势
export function yearlyTrendChart(data, dateField = 'article_date', valueField = null, { title = '', color = '#3b82f6', showCounts = true, showAverages = false } = {}) {
  const trendData = Statistics.yearlyTrend(data, dateField, valueField)
  const result = []
  if (showCounts) {
    result.push({
      x: trendData.years,
      y: trendData.years.map(year => trendData.counts[year]),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color, width: 3 },
      marker: { size: 8 },
      name: title || '发表数量'
    })
  }
  if (showAverages && valueField && trendData.averages) {
    result.push({
      x: trendData.years,
      y: trendData.years.map(year => trendData.averages[year]),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#10b981', width: 3 },
      marker: { size: 8 },
      name: `平均${valueField}`,
      yaxis: 'y2'
    })
  }
  return result
}