<script setup lang="ts">
import { House } from '@element-plus/icons-vue';

import type { BreadcrumbItem } from '../lib/docs';

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav
    v-if="items.length"
    class="breadcrumb-nav"
    aria-label="Breadcrumb"
  >
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">
        <ElIcon><House /></ElIcon>
      </ElBreadcrumbItem>
      <ElBreadcrumbItem
        v-for="item in items"
        :key="item.href"
        :to="{ path: item.href }"
      >
        {{ item.title }}
      </ElBreadcrumbItem>
    </ElBreadcrumb>
  </nav>
</template>
