module.exports = {
  title: '云代账开发文档',
  description: '云代账开发文档',
  port: '9000',
  themeConfig: {
    sidebarDepth: 2,
    sidebar: {
      '/components/': [''],
      '/utils/': [''],
      '/redux/': [''],
      '/standard/': [''],
      '/': [''],
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/' },
      { text: '规范', link: '/standard/' },
      { text: '工具函数', link: '/utils/' },
    ],
    lastUpdated: 'Last Updated',
  },
};
