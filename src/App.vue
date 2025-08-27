<template>
  <v-app>
    <Navbar />
    <v-main class="main-bg">
      <v-container class="main-bg" fluid>
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade" mode="out-in">
            <KeepAlive>
              <component :is="Component" :key="route.path" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </v-container>
    </v-main>
    <LoadingModal
      :show="isLoading"
      message="正在加载数据..."
      :show-delay="500"
      :min-show-time="1000"
    />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBiblio } from './stores/biblioStore'
import Navbar from './components/Navbar.vue'
import LoadingModal from './components/LoadingModal.vue'

const router = useRouter()
const biblio = useBiblio()
const isLoading = computed(() => biblio.loading)

onMounted(async () => {
  if (biblio.data.length === 0) {
    await biblio.loadData()
  }
})
</script>
