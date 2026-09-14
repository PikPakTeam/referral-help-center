<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import DocOutline from '../components/DocOutline.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import SearchBox from '../components/SearchBox.vue';
import SidebarNav from '../components/SidebarNav.vue';
import { getDocByRoute, getLocaleRouteFromSegments, getNav, type Locale } from '../lib/docs';

const props = defineProps<{
  locale: Locale;
  pathMatch: string[];
}>();

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

const doc = computed(() => getDocByRoute(props.locale, props.pathMatch));
const navItems = computed(() => getNav(props.locale));
const switchRoutes = computed(() => ({
  'zh-CN': getLocaleRouteFromSegments('zh-CN', props.pathMatch),
  'en-US': getLocaleRouteFromSegments('en-US', props.pathMatch),
}));

const searchPlaceholder = computed(() =>
  props.locale === 'zh-CN' ? '搜索当前语言文档' : 'Search this locale',
);

function submitSearch(query: string) {
  router.push({
    name: 'search',
    query: {
      locale: props.locale,
      q: query,
    },
  });
}

function handleContentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const anchor = target.closest('a');
  if (!(anchor instanceof HTMLAnchorElement)) {
    return;
  }

  const href = anchor.getAttribute('href');
  if (!href || !href.startsWith('/')) {
    return;
  }

  event.preventDefault();
  router.push(href);
}

watchEffect(() => {
  if (!doc.value) {
    document.title = 'Document Not Found';
    return;
  }

  document.title = `${doc.value.title} | PikPak Referral Help Center`;
});
</script>

<template>
  <main
    v-if="doc"
    class="docs-layout"
  >
    <aside class="docs-layout__sidebar">
      <RouterLink
        class="docs-layout__brand"
        :to="`/${locale}`"
      >
        PikPak Referral Help Center
      </RouterLink>
      <SearchBox
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        @submit="submitSearch"
      />
      <SidebarNav
        :current-path="route.path"
        :items="navItems"
      />
    </aside>

    <section class="docs-layout__content">
      <header class="docs-layout__header">
        <RouterLink
          class="docs-layout__home"
          to="/"
        >
          All Docs
        </RouterLink>
        <LanguageSwitcher
          :current-locale="locale"
          :target-routes="switchRoutes"
        />
      </header>
      <article
        class="markdown-body"
        @click="handleContentClick"
        v-html="doc.html"
      />
    </section>

    <DocOutline :headings="doc.headings" />
  </main>

  <main
    v-else
    class="not-found"
  >
    <div class="not-found__card">
      <h1>Document not found</h1>
      <p>The requested document route does not exist in this locale.</p>
      <RouterLink
        class="button button--primary"
        :to="`/${locale}`"
      >
        Go to locale home
      </RouterLink>
    </div>
  </main>
</template>
