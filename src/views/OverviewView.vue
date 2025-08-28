<template>
  <v-container class="py-8" fluid>
      <v-row class="mb-6" justify="center">
        <v-col cols="auto">
          <StatCard class="custom-card" :title="$t('stat.totalPapers')" :value="totalCount ?? 0" icon="📄"/>
        </v-col>
        <v-col cols="auto">
          <StatCard class="custom-card" :title="$t('stat.totalJournals')" :value="availableYears?.length ?? 0" icon="📚"/>
        </v-col>
        <v-col cols="auto">
          <StatCard class="custom-card" :title="$t('stat.authors')" :value="availableCancerTypes?.length ?? 0" icon="👨‍🔬"/>
        </v-col>
        <v-col cols="auto">
          <StatCard class="custom-card" :title="$t('stat.countries')" :value="availableNetworkTypes?.length ?? 0" icon="🌍"/>
        </v-col>
        <v-col cols="auto">
          <StatCard class="custom-card" :title="$t('stat.updatedOn')" :value="updatedDate || ''" icon="🕒"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <ChartTest1 />
        </v-col>
        <v-col cols="12" md="6">
          <ChartTest2 />
        </v-col>
        <v-col cols="12" md="6">
          <ChartTest3 />
        </v-col>
        <v-col cols="12" md="6">
          <ChartTest4 />
        </v-col>
      </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useBiblio } from '../stores/biblioStore'
import StatCard from '../components/StatCard.vue'
import ChartTest1 from '../components/charts/charttest1.vue'
import ChartTest2 from '../components/charts/charttest2.vue'
import ChartTest3 from '../components/charts/charttest3.vue'
import ChartTest4 from '../components/charts/charttest4.vue'

const store = useBiblio()
const hasData = computed(() => Array.isArray(store.data) && store.data.length > 0)
const totalCount = store.totalCount
const availableYears = store.availableYears
const availableCancerTypes = store.availableCancerTypes
const availableNetworkTypes = store.availableNetworkTypes
const updatedDate = store.updatedDate

onMounted(async () => {
  if (!hasData.value && !store.loading) {
    await store.loadData()
  }
})

watch(() => store.data, (val) => {
  // 可在此处做额外处理，如触发动画等
})
</script>
