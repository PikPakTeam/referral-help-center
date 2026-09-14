<script setup lang="ts">
import { useRouter } from 'vue-router';

import type { Locale } from '../lib/docs';

const props = defineProps<{
  currentLocale: Locale;
  targetRoutes: Record<Locale, string>;
}>();

const router = useRouter();

const localeLabels: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

function switchLocale(locale: Locale) {
  router.push(props.targetRoutes[locale]);
}
</script>

<template>
  <ElButtonGroup class="language-switcher">
    <ElButton
      v-for="locale in ['zh-CN', 'en-US']"
      :key="locale"
      :plain="locale !== currentLocale"
      :type="locale === currentLocale ? 'primary' : 'default'"
      class="language-switcher__item"
      @click="switchLocale(locale as Locale)"
    >
      {{ localeLabels[locale as Locale] }}
    </ElButton>
  </ElButtonGroup>
</template>
