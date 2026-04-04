import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/home',
    component: () => import('#/views/dashboard/home/index.vue'),
    meta: {
      affixTab: true,
      order: -1,
      icon: 'carbon:workspace',
      title: $t('page.dashboard.home'),
    },
  },
  {
    name: 'Profile',
    path: '/profile',
    component: () => import('#/views/_core/profile/index.vue'),
    meta: {
      icon: 'ant-design:profile-outlined',
      title: $t('ui.widgets.profile'),
      hideInMenu: true,
    },
  },
];

export default routes;
