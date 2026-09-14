<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

import type { NavItem } from '../lib/docs';

defineProps<{
  items: NavItem[];
  title?: string;
  description?: string;
}>();
</script>

<template>
  <ElCard
    v-if="items.length"
    class="article-list"
  >
    <div class="article-list__header">
      <h2>{{ title ?? 'Articles' }}</h2>
      <p v-if="description">
        {{ description }}
      </p>
    </div>

    <div class="article-list__items">
      <ElCard
        v-for="item in items"
        :key="item.href"
        class="article-list__item"
        shadow="hover"
      >
        <RouterLink
          class="article-list__link"
          :to="item.href"
        >
          <span>{{ item.title }}</span>
          <ElIcon class="article-list__arrow">
            <ArrowRight />
          </ElIcon>
        </RouterLink>
      </ElCard>
    </div>
  </ElCard>
</template>
