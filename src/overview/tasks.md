# tasks

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
| RENAME rule.category                                                   AS ruleType
| RENAME kibana.alert.rule.execution.metrics.alert_counts.new            AS alertsNew
| RENAME kibana.alert.rule.execution.metrics.alert_counts.recovered      AS alertsRecovered
| RENAME kibana.alert.rule.execution.metrics.alert_counts.active         AS alertsActive
| RENAME kibana.alert.rule.execution.metrics.number_of_generated_actions AS actionsGenerated
| RENAME kibana.alert.rule.execution.metrics.number_of_triggered_actions AS actionsTriggered

| KEEP date, outcome, ruleType, duration, delay, totalRun, totalSearch, 
       alertsNew, alertsRecovered, alertsActive, actionsGenerated, actionsTriggered

| LIMIT 100
`.trim()
```

```js
const dataPR = esqlQuery(proxyPR.es, query)
const dataST = esqlQuery(proxyST.es, query)
const dataQA = esqlQuery(proxyQA.es, query)
```

Production:

```js
Inputs.table(dataPR)
```

Staging:

```js
Inputs.table(dataST)
```

QA:

```js
Inputs.table(dataQA)
```
