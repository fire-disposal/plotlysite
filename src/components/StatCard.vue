<template>
  <v-card class="pa-5 text-center d-flex flex-column align-center" elevation="2" style="border-radius:14px; min-width:160px; background:var(--card-bg); color:var(--text-color);">
    <div class="mb-2" style="font-size:2.2rem; color:var(--primary-color);">{{ icon }}</div>
    <div class="text-subtitle-1 mb-1" style="font-weight:500; color:var(--text-color);">{{ title }}</div>
    <div class="text-h5 font-weight-bold mb-1" style="letter-spacing:1px; color:var(--primary-color);">{{ value }}</div>
    <div v-if="desc" class="text-caption mt-1" style="color:var(--text-color);">{{ desc }}</div>
  </v-card>
</template>
 
<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  desc: String
})
</script>


