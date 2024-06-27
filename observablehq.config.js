// See https://observablehq.com/framework/config for documentation.
export default {
  title:     'eslp Dashboards',
  root:      'src',
  output:    'docs',
  cleanUrls: false,
  search:    true,
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
      path: '/alerting/'
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
