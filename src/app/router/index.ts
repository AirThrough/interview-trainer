import { createRouter, createWebHistory } from 'vue-router'

import { DocsPage } from '@/pages/docs'
import { SessionsPage } from '@/pages/sessions'
import { TrainPage } from '@/pages/train'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/docs',
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsPage,
    },
    {
      path: '/docs/:taskId',
      name: 'docs-task',
      component: DocsPage,
    },
    {
      path: '/train',
      name: 'train',
      component: TrainPage,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsPage,
    },
    {
      path: '/sessions/:sessionId',
      name: 'sessions-detail',
      component: SessionsPage,
    },
  ],
})

export default router
