<script setup lang="ts">
import type { TocHeading } from '../lib/markdown';

defineProps<{
  headings: TocHeading[];
}>();
</script>

<template>
  <aside
    v-if="headings.length"
    class="doc-outline"
  >
    <p class="doc-outline__title">
      On this page
    </p>
    <ul class="doc-outline__list">
      <li
        v-for="heading in headings"
        :key="heading.id"
        :class="['doc-outline__item', `is-level-${heading.level}`]"
      >
        <a :href="`#${heading.id}`">{{ heading.title }}</a>
      </li>
    </ul>
  </aside>
</template>
