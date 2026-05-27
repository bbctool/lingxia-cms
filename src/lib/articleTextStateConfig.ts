/**
 * TextStateFeature presets for article body.
 * Keep in sync with lingxia_home/lib/content/articleTextStateConfig.ts
 * No package imports — safe for CMS and frontend.
 */

type StyleObject = Record<string, string>;

type StateValues = Record<
  string,
  {
    css: StyleObject;
    label: string;
  }
>;

export type ArticleTextStateConfig = Record<string, StateValues>;

export const articleTextStateConfig: ArticleTextStateConfig = {
  color: {
    'theme-accent-1': {
      label: '主题金（浅）',
      css: { color: '#f0cfac' },
    },
    'theme-accent-2': {
      label: '主题金（中）',
      css: { color: '#c9a178' },
    },
    'theme-accent-3': {
      label: '主题金（深）',
      css: { color: '#8b684b' },
    },
    'theme-fg': {
      label: '正文白',
      css: { color: '#f5eadf' },
    },
    'theme-fg-muted': {
      label: '正文灰',
      css: { color: 'rgb(255 255 255 / 0.7)' },
    },
    'text-red': {
      label: '红色',
      css: {
        color:
          'light-dark(oklch(0.577 0.245 27.325), oklch(0.704 0.191 22.216))',
      },
    },
    'text-orange': {
      label: '橙色',
      css: {
        color:
          'light-dark(oklch(0.646 0.222 41.116), oklch(0.75 0.183 55.934))',
      },
    },
    'text-yellow': {
      label: '黄色',
      css: {
        color:
          'light-dark(oklch(0.553 0.195 38.402), oklch(0.879 0.169 91.605))',
      },
    },
    'text-green': {
      label: '绿色',
      css: {
        color:
          'light-dark(oklch(0.527 0.154 150.069), oklch(0.792 0.209 151.711))',
      },
    },
    'text-blue': {
      label: '蓝色',
      css: {
        color:
          'light-dark(oklch(0.546 0.245 262.881), oklch(0.707 0.165 254.624))',
      },
    },
    'text-purple': {
      label: '紫色',
      css: {
        color:
          'light-dark(oklch(0.558 0.288 302.321), oklch(0.714 0.203 305.504))',
      },
    },
    'text-pink': {
      label: '粉色',
      css: {
        color:
          'light-dark(oklch(0.592 0.249 0.584), oklch(0.718 0.202 349.761))',
      },
    },
  },
  fontSize: {
    'size-14': {
      label: '14px',
      css: { 'font-size': '14px' },
    },
    'size-16': {
      label: '16px',
      css: { 'font-size': '16px' },
    },
    'size-18': {
      label: '18px',
      css: { 'font-size': '18px' },
    },
    'size-20': {
      label: '20px',
      css: { 'font-size': '20px' },
    },
    'size-24': {
      label: '24px',
      css: { 'font-size': '24px' },
    },
    'size-28': {
      label: '28px',
      css: { 'font-size': '28px' },
    },
  },
  lineHeight: {
    'leading-150': {
      label: '行距 1.5',
      css: { 'line-height': '1.5' },
    },
    'leading-175': {
      label: '行距 1.75',
      css: { 'line-height': '1.75' },
    },
    'leading-200': {
      label: '行距 2.0',
      css: { 'line-height': '2' },
    },
    'leading-240': {
      label: '行距 2.4',
      css: { 'line-height': '2.4' },
    },
  },
};
