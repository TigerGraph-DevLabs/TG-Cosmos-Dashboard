import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    dark:true,
    compact: true,
  },
  theme:{
    'heading-color': '#EBEBEB',
    'text-color': '#EBEBEB',
    'text-color-secondary': '#696969',
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'TigerGraph/CosmoGraph',
    style:{
      
    }
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
      icon: 'HomeOutlined',
    },
    {
      name: 'Cosmograph Visualization',
      path: '/cosmograph',
      component: './Cosmograph',
      icon: 'ForkOutlined',
    },
    {
      name: 'Tigergraph Configuration',
      path: '/tgconfig',
      component: './Tgconfig',
      icon: 'SettingOutlined',
  },
  ],
  npmClient: 'yarn',
});

