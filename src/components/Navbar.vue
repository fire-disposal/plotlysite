<template>
  <v-app-bar
    color="bg"
    dark
    app
    flat
    elevation="2"
    :style="{
      boxShadow: 'inset 0 -2px 6px -4px var(--shadow-color)',
      background: 'var(--card-bg)'
    }"
  >
    <v-toolbar-title class="d-flex align-center">
      <v-icon left class="mr-2">mdi-school</v-icon>
      <span style="font-weight: 600">{{ t("about.title") }}</span>
    </v-toolbar-title>
    <v-btn
      text
      class="nav-btn mx-3"
      :class="{ 'nav-btn--active': $route.path === '/about' }"
      to="/about"
      >{{ t("nav.about") }}</v-btn
    >
    <v-btn
      text
      class="nav-btn mx-3"
      :class="{ 'nav-btn--active': $route.path === '/overview' }"
      to="/overview"
      >{{ t("nav.overview") }}</v-btn
    >
    <v-btn
      text
      class="nav-btn mx-3"
      :class="{ 'nav-btn--active': $route.path === '/filters' }"
      to="/filters"
      >{{ t("nav.filters") }}</v-btn
    >
    <v-spacer />
    <v-btn icon class="mx-1" @click="toggleTheme">
      <v-icon>{{
        currentTheme === "dark" ? "mdi-weather-sunny" : "mdi-weather-night"
      }}</v-icon>
    </v-btn>
    <v-menu>
      <template #activator="{ props }">
        <v-btn icon v-bind="props" class="mx-1">
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="handleLangSelect('zh')">
          <v-list-item-title>中文</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLangSelect('en')">
          <v-list-item-title>English</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const currentTheme = ref("light");

// 自动检测系统主题并监听变化
const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

const detectSystemTheme = () => {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemDark ? "dark" : "light";
};

const themeListener = (e) => {
  setTheme(e.matches ? "dark" : "light");
};

onMounted(() => {
  // 优先读取本地存储，否则跟随系统
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme);
  } else {
    setTheme(detectSystemTheme());
  }
  // 监听系统主题变化
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", themeListener);
});

onBeforeUnmount(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", themeListener);
});

const toggleTheme = () => {
  const nextTheme = currentTheme.value === "dark" ? "light" : "dark";
  setTheme(nextTheme);
};

const handleLangSelect = (lang) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
};
</script>
