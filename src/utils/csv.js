// csv.js - 统一CSV读取与解析
import Papa from 'papaparse'

/**
 * 解析CSV文本为对象数组
 * @param {string} csvText
 * @returns {Array<Object>}
 */
export function parseCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ',',
    transformHeader: h => h.trim(),
    transform: v => v?.trim()
  })
  if (result.errors.length > 0) {
    console.warn('CSV解析错误:', result.errors)
  }
  return result.data || []
}

/**
 * 通过fetch异步加载CSV文件
 * @param {string} url
 * @returns {Promise<Array<Object>>}
 */
export async function fetchCSV(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`加载CSV失败: ${response.status}`)
  const text = await response.text()
  return parseCSV(text)
}

/**
 * 解析本地上传的CSV文件
 * @param {File} file
 * @returns {Promise<Array<Object>>}
 */
export async function parseLocalCSVFile(file) {
  const text = await file.text()
  return parseCSV(text)
}