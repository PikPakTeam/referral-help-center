<script setup lang="ts">
import type { NavItem } from '../lib/docs';

defineOptions({
  name: 'SidebarNav',
});

defineProps<{
  items: NavItem[];
  currentPath: string;
}>();
</script>

<template>
  <ul class="sidebar-nav">
    <li
      v-for="item in items"
      :key="item.href"
      class="sidebar-nav__item"
    >
      <RouterLink
        :class="['sidebar-nav__link', { 'is-active': currentPath === item.href }]"
        :to="item.href"
      >
        {{ item.title }}
      </RouterLink>
      <SidebarNav
        v-if="item.children.length"
        :current-path="currentPath"
        :items="item.children"
      />
    </li>
  </ul>
</template>
