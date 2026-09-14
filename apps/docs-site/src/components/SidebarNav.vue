<script setup lang="ts">
import type { NavItem } from '../lib/docs';

import SidebarNavItem from './SidebarNavItem.vue';

defineProps<{
  items: NavItem[];
  currentPath: string;
}>();
</script>

<template>
  <ElMenu
    :default-active="currentPath"
    class="sidebar-nav"
    router
  >
    <SidebarNavItem
      v-for="item in items"
      :key="item.href"
      :item="item"
    />
  </ElMenu>
</template>
