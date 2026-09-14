<script setup lang="ts">
import type { NavItem } from '../lib/docs';

defineOptions({
  name: 'SidebarNavItem',
});

defineProps<{
  item: NavItem;
}>();
</script>

<template>
  <ElSubMenu
    v-if="item.children.length"
    :index="item.href"
  >
    <template #title>
      <span>{{ item.title }}</span>
    </template>
    <SidebarNavItem
      v-for="child in item.children"
      :key="child.href"
      :item="child"
    />
  </ElSubMenu>
  <ElMenuItem
    v-else
    :index="item.href"
  >
    {{ item.title }}
  </ElMenuItem>
</template>
