// See https://observablehq.com/framework/config for documentation.
export default {
  title:     'eslp Dashboards',
  root:      'src',
  output:    'docs',
  cleanUrls: false,
  search:    true,
  head:      '<link rel="icon" type="image/png" href="favicon.png"></link>',
  pages: [
    {
      name: 'Dashboards for Overview',
      path: '/overview/',
      pages: [
        { path: 'overview/tasks.html', name: 'Tasks' },
      ],
    },
    {
      name: 'Dashboards for Alerting',
      path: '/alerting/',
      pages: [
        { path: 'alerting/rules.html', name: 'Rules' },
        { path: 'alerting/connectors.html', name: 'Connectors' },
      ],
    },
    {
      name: `Odds 'n Ends`,
      path: '/odds-n-ends/',
      pages: [
        { path: 'odds-n-ends/esql-query.html', name: 'ES|QL query tester' },
      ],
    },
  ]
}

