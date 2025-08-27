<template>
  <v-dialog v-model="visible" persistent max-width="320">
    <v-card class="pa-4" elevation="3" style="border-radius:16px; background:var(--card-bg); color:var(--text-color);">
      <v-row justify="center" align="center" class="mb-2">
        <v-progress-circular indeterminate color="var(--primary-color)" size="36" />
      </v-row>
      <v-card-text class="text-center text-body-2" style="letter-spacing:1px; color:var(--text-color);">
        {{ message }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  message: {
    type: String,
    default: '正在加载数据'
  }
})

const visible = ref(false)
watch(() => props.show, (val) => {
  visible.value = val
})
</script>