<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ArticleList from '../components/ArticleList.vue';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import DocOutline from '../components/DocOutline.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import SearchBox from '../components/SearchBox.vue';
import SidebarNav from '../components/SidebarNav.vue';
import {
  getBreadcrumbs,
  getDocByRoute,
  getLocaleRouteFromSegments,
  getNav,
  getSectionArticles,
  type Locale,
} from '../lib/docs';

const props = defineProps<{
  locale: Locale;
  pathMatch: string[];
}>();

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

const doc = computed(() => getDocByRoute(props.locale, props.pathMatch));
const navItems = computed(() => getNav(props.locale));
const breadcrumbs = computed(() => getBreadcrumbs(props.locale, props.pathMatch));
const sectionArticles = computed(() => getSectionArticles(props.locale, props.pathMatch));
const switchRoutes = computed(() => ({
  'zh-CN': getLocaleRouteFromSegments('zh-CN', props.pathMatch),
  'en-US': getLocaleRouteFromSegments('en-US', props.pathMatch),
}));

const searchPlaceholder = computed(() =>
  props.locale === 'zh-CN' ? '搜索当前语言文档' : 'Search this locale',
);
const searchButtonLabel = computed(() => (props.locale === 'zh-CN' ? '搜索' : 'Search'));
const sectionListTitle = computed(() => (props.locale === 'zh-CN' ? '本栏文章' : 'Articles in This Section'));
const sectionListDescription = computed(() =>
  props.locale === 'zh-CN'
    ? '继续浏览当前栏目下的常见问题与说明。'
    : 'Continue browsing the related articles in this section.',
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

  // Markdown content is rendered as plain HTML anchors, so internal doc links
  // need to be handed back to vue-router to keep navigation inside the SPA.
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
  <ElContainer
    v-if="doc"
    class="docs-layout"
  >
    <ElAside
      class="docs-layout__sidebar"
      width="300px"
    >
      <RouterLink
        class="docs-layout__brand"
        :to="`/${locale}`"
      >
        PikPak Referral Help Center
      </RouterLink>
      <SearchBox
        v-model="searchQuery"
        :button-label="searchButtonLabel"
        :placeholder="searchPlaceholder"
        @submit="submitSearch"
      />
      <SidebarNav
        :current-path="route.path"
        :items="navItems"
      />
    </ElAside>

    <ElContainer
      direction="vertical"
      class="docs-layout__main"
    >
      <ElHeader class="docs-layout__header">
        <BreadcrumbNav :items="breadcrumbs" />
        <LanguageSwitcher
          :current-locale="locale"
          :target-routes="switchRoutes"
        />
      </ElHeader>
      <ElMain class="docs-layout__content">
        <article
          class="markdown-body"
          @click="handleContentClick"
          v-html="doc.html"
        />
        <ArticleList
          v-if="doc.isSectionHome"
          :description="sectionListDescription"
          :items="sectionArticles"
          :title="sectionListTitle"
        />
      </ElMain>
    </ElContainer>

    <ElAside
      class="docs-layout__outline"
      width="260px"
    >
      <DocOutline :headings="doc.headings" />
    </ElAside>
  </ElContainer>

  <main
    v-else
    class="not-found"
  >
    <ElCard class="not-found__card">
      <ElEmpty description="Document not found">
        <RouterLink :to="`/${locale}`">
          <ElButton type="primary">
            Go to locale home
          </ElButton>
        </RouterLink>
      </ElEmpty>
    </ElCard>
  </main>
</template>
