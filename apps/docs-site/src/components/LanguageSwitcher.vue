<script setup lang="ts">
import type { Locale } from '../lib/docs';

defineProps<{
  currentLocale: Locale;
  targetRoutes: Record<Locale, string>;
}>();
</script>

<template>
  <div class="language-switcher">
    <RouterLink
      v-for="locale in ['zh-CN', 'en-US']"
      :key="locale"
      :class="['language-switcher__item', { 'is-active': locale === currentLocale }]"
      :to="targetRoutes[locale as Locale]"
    >
      {{ locale }}
    </RouterLink>
  </div>
</template>
