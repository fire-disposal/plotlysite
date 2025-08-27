import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useError = defineStore('error', () => {
  const message = ref('')
  const show = ref(false)

  function setError(msg) {
    message.value = msg
    show.value = true
  }

  function clearError() {
    show.value = false
    message.value = ''
  }

  return { message, show, setError, clearError }
})
