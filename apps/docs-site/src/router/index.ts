import { createRouter, createWebHistory } from 'vue-router';

import DocPage from '../pages/DocPage.vue';
import HomePage from '../pages/HomePage.vue';
import SearchPage from '../pages/SearchPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
    },
    {
      path: '/:locale(zh-CN|en-US)/:pathMatch(.*)*',
      name: 'doc',
      component: DocPage,
      props: (route) => ({
        locale: route.params.locale,
        pathMatch: Array.isArray(route.params.pathMatch)
          ? route.params.pathMatch
          : route.params.pathMatch
            ? [route.params.pathMatch]
            : [],
      }),
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return {
      top: 0,
    };
  },
});
