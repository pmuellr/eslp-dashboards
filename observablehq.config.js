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
      name: 'Multiples',
      pages: [
        { path: 'multiples/multiples.html', name: 'Multiples' },
      ],
    },
    {
      name: 'Logs',
      pages: [
        { path: 'logs/large-responses.html', name: 'Large Responses' },
      ],
    },
    {
      name: 'Alerting',
      pages: [
        { path: 'alerting/rules.html', name: 'Rules' },
        { path: 'alerting/connectors.html', name: 'Connectors' },
      ],
    },
    {
      name: `Odds 'n Ends`,
      pages: [
        { path: 'odds-n-ends/esql-query.html', name: 'ES|QL query tester' },
      ],
    },
  ]
}

