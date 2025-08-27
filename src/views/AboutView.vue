<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-8 custom-card" elevation="3">
          <v-card-title class="text-h4 text-center mb-4">{{ t('about.title') }}</v-card-title>
          <v-card-text class="text-center mb-6">
            {{ t('about.desc1') }}<br>
            {{ t('about.desc2') }}
          </v-card-text>
          <v-row justify="center" class="mb-6">
            <v-col cols="auto">
              <v-card class="pa-6 custom-card" elevation="1">
                <span class="text-h3 d-block text-center">📊</span>
                <div class="font-weight-bold mt-2">{{ t('about.feature1') }}</div>
              </v-card>
            </v-col>
            <v-col cols="auto">
              <v-card class="pa-6 custom-card" elevation="1">
                <span class="text-h3 d-block text-center">🔎</span>
                <div class="font-weight-bold mt-2">{{ t('about.feature2') }}</div>
              </v-card>
            </v-col>
            <v-col cols="auto">
              <v-card class="pa-6 custom-card" elevation="1">
                <span class="text-h3 d-block text-center">✨</span>
                <div class="font-weight-bold mt-2">{{ t('about.feature3') }}</div>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-center">
            <router-link to="/overview">
              <v-btn color="primary" size="large">{{ t('about.start') }}</v-btn>
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>