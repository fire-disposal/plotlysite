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
    <!-- 全局错误提示 -->
    <v-snackbar
      v-model="errorStore.show"
      color="error"
      timeout="5000"
      location="bottom right"
    >
      {{ errorStore.message }}
      <template #actions>
        <v-btn color="white" text @click="errorStore.clearError">{{ t('nav.reload') }}</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBiblio } from './stores/biblioStore'
import Navbar from './components/Navbar.vue'
import { useError } from './stores/useError'
import { useI18n } from 'vue-i18n'
const errorStore = useError()
const { t, locale } = useI18n()

const router = useRouter()
const biblio = useBiblio()
const isLoading = computed(() => biblio.loading)


onMounted(async () => {
  if (biblio.data.length === 0) {
    await biblio.loadData()
  }
})

</script>
