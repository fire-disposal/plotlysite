import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStateStore = defineStore('globalState', () => {
  const initialized = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const activeView = ref('')
  const lastDataLoadTime = ref(null)

  function setInitialized(val) {
    initialized.value = !!val
  }
  function setActiveView(view) {
    activeView.value = view
  }
  function setGlobalError(err) {
    error.value = err
  }
  function updateLastDataLoadTime() {
    lastDataLoadTime.value = Date.now()
  }

  async function initializeApp(forceReload = false, loadDataFn = null) {
    if (initialized.value && !forceReload) return
    try {
      loading.value = true
      error.value = null
      if (typeof loadDataFn === 'function') {
        await loadDataFn(forceReload)
      }
      initialized.value = true
      lastDataLoadTime.value = Date.now()
    } catch (e) {
      error.value = e.message || '应用初始化失败'
    } finally {
      loading.value = false
    }
  }

  return {
    initialized,
    loading,
    error,
    activeView,
    lastDataLoadTime,
    setInitialized,
    setActiveView,
    setGlobalError,
    updateLastDataLoadTime,
    initializeApp
  }
})