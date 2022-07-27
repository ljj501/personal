module.exports = {
  name: 'ifly-ui',
  build: {
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/ifly-ui/',
    },
  },
  site: {
    title: 'ifly-ui',
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    hideSimulator: true,
    nav: [{
        title: '开发指南',
        items: [{
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [{
            path: 'demo-button',
            title: 'DemoButton 按钮',
          },
          {
            path: 'ifly-button',
            title: 'IflyButton 按钮',
          },
        ],
      },
    ],
  },
};