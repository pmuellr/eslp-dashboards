# Tasks

```js
import { getProxies } from '../components/proxy-picker.js';
import { esqlQuery } from '../components/esql.js';
const proxies = await getProxies();
const proxyPR = proxies.get('overview-pr')
const proxyST = proxies.get('overview-st')
const proxyQA = proxies.get('overview-qa')
```

production: ${proxyPR ? '✅' : '❌' } ;
staging:    ${proxyST ? '✅' : '❌' } ;
qa:         ${proxyQA ? '✅' : '❌' }

```js
const query = `
FROM .kibana-event-log-*
| WHERE @timestamp > NOW() - 4 hour
| WHERE event.provider == "alerting"
| WHERE event.action   == "execute"

| EVAL duration    = ROUND(event.duration / 1000000000.0, 3)
| EVAL delay       = ROUND(kibana.task.schedule_delay / 1000000000.0, 3)
| EVAL totalRun    = ROUND(kibana.alert.rule.execution.metrics.total_run_duration_ms / 1000.0, 3)
| EVAL totalSearch = ROUND(kibana.alert.rule.execution.metrics.total_search_duration_ms / 1000.0, 3)

| RENAME event.start                                                     AS date
| RENAME event.outcome                                                   AS outcome
| RENAME rule.id                                                         AS ruleId
| RENAME rule.category                                                   AS ruleType
| RENAME kibana.alert.rule.execution.metrics.alert_counts.new            AS alertsNew
| RENAME kibana.alert.rule.execution.metrics.alert_counts.recovered      AS alertsRecovered
| RENAME kibana.alert.rule.execution.metrics.alert_counts.active         AS alertsActive
| RENAME kibana.alert.rule.execution.metrics.number_of_generated_actions AS actionsGenerated
| RENAME kibana.alert.rule.execution.metrics.number_of_triggered_actions AS actionsTriggered

| KEEP date, outcome, ruleType, ruleId, duration, delay, totalRun, totalSearch, 
       alertsNew, alertsRecovered, alertsActive, actionsGenerated, actionsTriggered

| SORT date desc
| LIMIT 5000
`.trim()
```

```js
const dataPR = proxyPR.es ? await esqlQuery(proxyPR.es, query) : []
const dataST = proxyST.es ? await esqlQuery(proxyST.es, query) : []
const dataQA = proxyQA.es ? await esqlQuery(proxyQA.es, query) : []

const dataPRenv = dataPR.map(datum => ({ ...datum, env: 'production' }))
const dataSTenv = dataST.map(datum => ({ ...datum, env: 'staging' }))
const dataQAenv = dataQA.map(datum => ({ ...datum, env: 'qa' }))
const data = dataPRenv.concat(dataSTenv).concat(dataQAenv)
const envSort = { production: '1-production', staging: '2-staging', qa: '3-qa' }
```
   
# rule duration by type

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  y: { label: 'duration (seconds)' },
  marks: [
    Plot.frame(),
    Plot.dot(data, { 
      x: 'date', 
      y: 'duration', 
      fx: (d) => envSort[d.env],
      fill: 'ruleType',
      channels: {name: 'name', outcome: 'outcome', ruleId: 'ruleId', },
      tip: true      
    })
  ]
})
```

# rule errors by type

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  y: { label: 'duration (seconds)' },
  marks: [
    Plot.frame(),
    Plot.dot(data, { 
      x: 'date', 
      y: 'duration', 
      fx: (d) => envSort[d.env],
      fill: 'outcome',
      channels: {name: 'name', outcome: 'outcome', ruleId: 'ruleId', },
      tip: true      
    })
  ]
})
```


<!-- data as tables -->
<details><summary>data tables</summary>

Production: ${display(Inputs.table(dataPRenv))}

Staging: ${display(Inputs.table(dataSTenv))}

QA: ${display(Inputs.table(dataQAenv))}

</details>
