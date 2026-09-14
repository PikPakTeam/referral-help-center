<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import SearchBox from '../components/SearchBox.vue';
import bannerImage from '../assets/help-center/banner.png';
import dataDetailsIcon from '../assets/icons/03-data-details.svg';
import inviteShareIcon from '../assets/icons/02-invite-share.svg';
import levelBenefitsIcon from '../assets/icons/06-level-benefits.svg';
import planOverviewIcon from '../assets/icons/01-plan-overview.svg';
import revenueSettlementIcon from '../assets/icons/04-revenue-settlement.svg';
import tipsIcon from '../assets/icons/07-tips.svg';
import withdrawalIcon from '../assets/icons/05-withdrawal.svg';
import { getDocByRoute, getDocByRelativePath, getNav, locales, type Locale, type NavItem } from '../lib/docs';

interface HomeCategoryCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  articles: NavItem[];
}

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

const categoryIcons: Record<string, string> = {
  '1.计划概览': planOverviewIcon,
  '2.邀请与分享': inviteShareIcon,
  '3.数据与明细': dataDetailsIcon,
  '4.收益与结算': revenueSettlementIcon,
  '5.提现': withdrawalIcon,
  '6.等级与权益': levelBenefitsIcon,
  '7.使用技巧': tipsIcon,
};

function resolveLocale(value: unknown): Locale {
  // Keep the landing page locale controlled by query so "/" can stay as the common site entry.
  return locales.includes(value as Locale) ? (value as Locale) : 'zh-CN';
}

function getSectionKey(item: NavItem): string {
  return item.href.split('/').filter(Boolean)[1] ?? '';
}

function formatSectionTitle(title: string): string {
  return title.replace(/^\d+\./, '');
}

const currentLocale = computed(() => resolveLocale(route.query.locale));
const currentNav = computed(() => getNav(currentLocale.value));
const localeHomeDoc = computed(() => getDocByRelativePath(currentLocale.value, 'README.md'));
const switchRoutes = computed(() => ({
  'zh-CN': '/?locale=zh-CN',
  'en-US': '/?locale=en-US',
}));

const heroTitle = computed(() => localeHomeDoc.value?.title ?? 'PikPak Referral Help Center');
const heroDescription = computed(
  () =>
    localeHomeDoc.value?.excerpt ??
    (currentLocale.value === 'zh-CN'
      ? '围绕引荐计划 Pro 的规则、邀请方式、收益结算、提现和等级权益的帮助文档。'
      : 'Help documentation for Referral Program Pro covering program rules, invitation methods, earnings settlement, withdrawals, and level benefits.'),
);

const categoryCards = computed<HomeCategoryCard[]>(() =>
  currentNav.value.map((item) => {
    const sectionKey = getSectionKey(item);
    const sectionDoc = getDocByRoute(currentLocale.value, [sectionKey]);

    return {
      title: formatSectionTitle(item.title),
      description: sectionDoc?.excerpt ?? '',
      href: item.href,
      icon: categoryIcons[sectionKey] ?? planOverviewIcon,
      articles: item.children.slice(0, 3),
    };
  }),
);

const searchPlaceholder = computed(() =>
  currentLocale.value === 'zh-CN' ? '搜索帮助中心文档' : 'Search help center docs',
);

const searchButtonLabel = computed(() => (currentLocale.value === 'zh-CN' ? '搜索' : 'Search'));
const showMoreLabel = computed(() => (currentLocale.value === 'zh-CN' ? '查看更多' : 'Show more'));

function submitSearch(query: string) {
  router.push({
    name: 'search',
    query: {
      locale: currentLocale.value,
      q: query,
    },
  });
}

function openCategory(href: string) {
  router.push(href);
}
</script>

<template>
  <main class="help-center-home">
    <ElCard
      class="help-center-home__hero"
      shadow="never"
    >
      <div class="help-center-home__hero-inner">
        <div class="help-center-home__hero-content">
          <div class="help-center-home__hero-topbar">
            <p class="help-center-home__eyebrow">
              PikPak Referral Docs
            </p>
            <LanguageSwitcher
              :current-locale="currentLocale"
              :target-routes="switchRoutes"
            />
          </div>

          <h1>{{ heroTitle }}</h1>
          <p class="help-center-home__description">
            {{ heroDescription }}
          </p>

          <SearchBox
            v-model="searchQuery"
            :button-label="searchButtonLabel"
            :placeholder="searchPlaceholder"
            class="help-center-home__search"
            @submit="submitSearch"
          />
        </div>

        <div class="help-center-home__hero-visual">
          <img
            :src="bannerImage"
            alt="Help center banner"
          >
        </div>
      </div>
    </ElCard>

    <section class="help-center-home__categories">
      <ElCard
        v-for="card in categoryCards"
        :key="card.href"
        class="category-card"
        shadow="hover"
        @click="openCategory(card.href)"
      >
        <div class="category-card__body">
          <div class="category-card__icon-wrap">
            <img
              :src="card.icon"
              :alt="card.title"
              class="category-card__icon"
            >
          </div>

          <h2 class="category-card__title">
            {{ card.title }}
          </h2>
          <p class="category-card__description">
            {{ card.description }}
          </p>

          <ul class="category-card__articles">
            <li
              v-for="article in card.articles"
              :key="article.href"
              @click.stop
            >
              <RouterLink :to="article.href">
                {{ article.title }}
              </RouterLink>
            </li>
            <li
              v-if="card.articles.length"
              class="category-card__more"
              @click.stop
            >
              <ElButton
                link
                type="primary"
                @click="openCategory(card.href)"
              >
                {{ showMoreLabel }}
                <span class="category-card__more-arrow">→</span>
              </ElButton>
            </li>
          </ul>
        </div>
      </ElCard>
    </section>
  </main>
</template>
