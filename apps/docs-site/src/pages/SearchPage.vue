<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import SearchBox from '../components/SearchBox.vue';
import SidebarNav from '../components/SidebarNav.vue';
import { getNav, locales, type Locale } from '../lib/docs';
import { searchDocs } from '../lib/search';

const route = useRoute();
const router = useRouter();

function resolveLocale(value: unknown): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : 'zh-CN';
}

const locale = computed(() => resolveLocale(route.query.locale));
const query = ref(typeof route.query.q === 'string' ? route.query.q : '');
const results = computed(() => searchDocs(locale.value, query.value));
const navItems = computed(() => getNav(locale.value));
const switchRoutes = computed(() => ({
  'zh-CN': `/search?locale=zh-CN&q=${encodeURIComponent(query.value)}`,
  'en-US': `/search?locale=en-US&q=${encodeURIComponent(query.value)}`,
}));

watch(
  () => route.query.q,
  (value) => {
    query.value = typeof value === 'string' ? value : '';
  },
  { immediate: true },
);

function submitSearch(value: string) {
  router.push({
    name: 'search',
    query: {
      locale: locale.value,
      q: value,
    },
  });
}
</script>

<template>
  <ElContainer class="docs-layout">
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
        v-model="query"
        :placeholder="locale === 'zh-CN' ? '搜索当前语言文档' : 'Search this locale'"
        @submit="submitSearch"
      />
      <SidebarNav
        :current-path="''"
        :items="navItems"
      />
    </ElAside>

    <ElContainer
      direction="vertical"
      class="docs-layout__main"
    >
      <ElHeader class="docs-layout__header">
        <RouterLink to="/">
          <ElButton
            link
            class="docs-layout__home"
            type="primary"
          >
            All Docs
          </ElButton>
        </RouterLink>
        <LanguageSwitcher
          :current-locale="locale"
          :target-routes="switchRoutes"
        />
      </ElHeader>

      <ElMain class="docs-layout__content">
        <section class="search-page">
          <h1>{{ locale === 'zh-CN' ? '搜索结果' : 'Search Results' }}</h1>
          <p class="search-page__summary">
            {{
              query
                ? `${results.length} result(s) for "${query}"`
                : locale === 'zh-CN'
                  ? '输入关键词开始搜索'
                  : 'Enter a keyword to search'
            }}
          </p>

          <div
            v-if="results.length"
            class="search-results"
          >
            <ElCard
              v-for="result in results"
              :key="result.id"
              class="search-results__item"
              shadow="hover"
            >
              <RouterLink
                class="search-results__title"
                :to="result.href"
              >
                {{ result.title }}
              </RouterLink>
              <p
                v-if="result.section"
                class="search-results__section"
              >
                {{ result.section }}
              </p>
              <p class="search-results__excerpt">
                {{ result.excerpt }}
              </p>
            </ElCard>
          </div>
          <ElEmpty
            v-else-if="query"
            :description="locale === 'zh-CN' ? '没有找到相关结果' : 'No matching results found'"
          />
        </section>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>
