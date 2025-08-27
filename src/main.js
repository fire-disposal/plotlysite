import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import { createI18n } from "vue-i18n";
// 语言包
import { messages } from "./locales/messages";
import App from "./App.vue";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify();

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "zh",
  fallbackLocale: "zh",
  messages,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(i18n);
app.use(vuetify);
app.mount("#app");
