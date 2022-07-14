import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    dark:true,
    compact: true,
  },
  theme:{
    'primary-color': '#FF6D00', 
    'heading-color': '#EBEBEB',
    'text-color': '#EBEBEB',
    'text-color-secondary': '#696969',
    'table-header-bg': '#1d1d1d',
    'table-body-sort-bg': '#696969',
    'table-row-hover-bg': '#262626',
    'table-header-cell-split-color': '#696969',
    'table-header-sort-bg': '#262626',
    'table-header-filter-active-bg': '#434343',
    'table-header-sort-active-bg': '#303030',
    'table-fixed-header-sort-active-bg': '#222',
    'table-filter-btns-bg': '#1f1f1f',
    'table-expanded-row-bg': '#1d1d1d',
    'table-filter-dropdown-bg': '#1f1f1f',
    'table-expand-icon-bg': 'transparent',
    'select-background': 'transparent',
    'select-dropdown-bg': '#1f1f1f',
    'select-clear-background': '#fff',
    'select-selection-item-bg': '#696969',
    'select-selection-item-border-color': '#303030',
    'select-multiple-disabled-background': '#fff',
    'select-multiple-item-disabled-color': '#595959',
    'select-multiple-item-disabled-border-color': '#1f1f1f',
    'select-item-selected-color': '#696969',
    'select-item-selected-bg': '#262626',
    'select-item-active-bg':'#262626',
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'TigerGraph/CosmoGraph',
    style:{
      backgroud: '#0D0D0D',
      theme:'dark',
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

