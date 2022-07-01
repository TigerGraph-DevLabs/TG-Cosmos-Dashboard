import { defineConfig } from '@umijs/max';

export default defineConfig(
  {
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'TigerGraph/CosmoGraph',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Home',
      path: '/home',
      component: './home',
    },
    {
      name: 'Cosmograph Visualization',
      path: '/cosmograph',
      component: './Cosmograph',
    },
    {
      name: 'Tigergraph Configuration',
      path: '/tgconfig',
      component: './Tgconfig',
  },
  ],
  npmClient: 'yarn',
});

