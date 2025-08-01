// dataProcess.js - 数据清洗、展开、分箱、编码、评分等
import _ from 'lodash'

// 数据收集技术展开
export function expandDataCollection(data) {
  return _.flatMap(data, row => {
    const techs = (row.data_collection_technology || 'None').replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^'+|'+$/g, ''))
    return techs.map(tech => ({
      ...row,
      dataColl_techniques: tech
    }))
  })
}

// 增强技术展开
export function expandAugmentation(data) {
  return data.map(row => {
    const aug = (row.augmentation_techniques || '').replace(/[\[\]]/g, '').split(',').map(s => s.trim().toLowerCase())
    const augTypes = ['color', 'geometrics', 'deletion', 'kernels', 'others', 'synthetic', 'none']
    const augFlags = {}
    augTypes.forEach(type => {
      augFlags[`aug_${type}`] = aug.some(a => a.includes(type))
    })
    return { ...row, ...augFlags }
  })
}

// 数据量分箱
export function binDataSize(data) {
  return data.map(row => {
    const size = Number(row.DataSize_all)
    return {
      ...row,
      DataSize_500: size < 500,
      DataSize_500gt: size > 500
    }
  })
}

// 预训练数据类型展开
export function expandPretraining(data) {
  return data.map(row => {
    const types = (row.datatype_pretrained || "['none']").replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^'+|'+$/g, ''))
    const flags = {}
    types.forEach(type => {
      if (type) flags[`pretrain_${type}`] = true
    })
    return { ...row, ...flags }
  })
}

// 清洗指定列
export function cleanColumns(data, columns) {
  return data.filter(row =>
    columns.every(col =>
      row[col] !== undefined &&
      row[col] !== null &&
      row[col] !== '' &&
      !isNaN(Number(row[col])) &&
      isFinite(Number(row[col]))
    )
  ).map(row => {
    const newRow = { ...row }
    columns.forEach(col => {
      if (_.isNumber(Number(newRow[col]))) {
        newRow[col] = Number(newRow[col])
      }
    })
    return newRow
  })
}

// one-hot 编码
export function oneHotEncode(data, columns) {
  let result = data
  columns.forEach(col => {
    const values = _.uniq(result.map(row => row[col]).filter(v => v !== undefined))
    result = _.flatMap(result, row =>
      values.map(val => ({
        ...row,
        [`${col}_${val}`]: row[col] === val ? 1 : 0
      }))
    )
  })
  return result
}

// 质量评分
export function calcQualityScore(data) {
  return data.map(row => {
    const data_avai_yes = row.raw_data_availability === 'yes'
    const code_avai = !!row.code_availability
    const methodology = !!row.methodological
    const performance_metrics = [
      'performance_cindex', 'performance_auc', 'performance_precision (PPV)',
      'performance_specificity', 'performance_NPV', 'performance_sensitivity (recall)',
      'performance_F1', 'performance_accuracy'
    ].filter(col => row[col] !== undefined && row[col] !== '').length >= 3
    const bench = !!row.benchmarking
    const imple_det = !!row.implementation_detail
    const external_val = !!row.external_val_set || !!row.multiple_cohorts_copy || !!row.multiple_cohorts
    const weights = {
      data_avai_yes: 1,
      code_avai: 1,
      methodology: 1,
      performance_metrics: 1,
      external_val: 1,
      bench: 1,
      imple_det: 1
    }
    const q_score =
      (data_avai_yes ? weights.data_avai_yes : 0) +
      (code_avai ? weights.code_avai : 0) +
      (methodology ? weights.methodology : 0) +
      (performance_metrics ? weights.performance_metrics : 0) +
      (external_val ? weights.external_val : 0) +
      (bench ? weights.bench : 0) +
      (imple_det ? weights.imple_det : 0)
    return { ...row, q_score }
  })
}