<template>
  <div class="stat bg-base-100 shadow rounded-lg flex flex-col items-center justify-center p-4">
    <div class="stat-figure text-3xl mb-2">{{ icon }}</div>
    <div class="stat-title text-sm opacity-60 mb-1">{{ title }}</div>
    <div class="stat-value text-lg font-bold">{{ value }}</div>
    <div v-if="desc" class="stat-desc text-xs mt-1 text-base-content/60">{{ desc }}</div>
  </div>
</template>
 
<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  desc: String
})
</script>