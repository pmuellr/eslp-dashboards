# Rules

Select a proxy:

```js
import { getProxies } from '../components/proxy-picker.js';
import { esqlQuery } from '../components/esql.js';
const proxies = await getProxies();
const proxy = view(Inputs.select(proxies))
```

Minutes to look back:

```js
const lookBackMinInput = view(Inputs.range([1, 60 * 24 * 7], {step: 1, value: 1}))
```

```js
const lookBackMin = lookBackMinInput || 1
```

```js
const query = `
FROM .kibana-event-log-*
| WHERE @timestamp > NOW() - ${lookBackMin} minutes
| WHERE event.provider == "alerting"
| WHERE event.action   == "execute"

| EVAL duration    = ROUND(event.duration / 1000000000.0, 3)
| EVAL delay       = ROUND(kibana.task.schedule_delay / 1000000000.0, 3)
| EVAL totalRun    = ROUND(kibana.alert.rule.execution.metrics.total_run_duration_ms / 1000.0, 3)
| EVAL totalSearch = ROUND(kibana.alert.rule.execution.metrics.total_search_duration_ms / 1000.0, 3)

| RENAME event.start                                                     AS date
| RENAME event.outcome                                                   AS outcome
| RENAME rule.id                                                         AS id
| RENAME rule.name                                                       AS name
| RENAME rule.category                                                   AS type
| RENAME kibana.alert.rule.execution.metrics.alert_counts.new            AS alertsNew
| RENAME kibana.alert.rule.execution.metrics.alert_counts.recovered      AS alertsRecovered
| RENAME kibana.alert.rule.execution.metrics.alert_counts.active         AS alertsActive
| RENAME kibana.alert.rule.execution.metrics.number_of_generated_actions AS actionsGenerated
| RENAME kibana.alert.rule.execution.metrics.number_of_triggered_actions AS actionsTriggered

| KEEP date, outcome, type, id, duration, delay, totalRun, totalSearch, message,
       alertsNew, alertsRecovered, alertsActive, actionsGenerated, actionsTriggered

| SORT date desc
| LIMIT 10000
`.trim()
```

```js
const data = await esqlQuery(proxy.es, query)
const channels = {
  date: 'date',
  name: 'name',
  message: 'message',
  outcome: 'outcome',
  type: 'type',
  id: 'id',
  duration: 'duration',
  delay: 'delay',
  totalRun: 'totalRun',
  totalSearch: 'totalSearch',
  alertsNew: 'alertsNew',
  alertsRecovered: 'alertsRecovered',
  alertsActive: 'alertsActive',
  actionsGenerated: 'actionsGenerated',
  actionsTriggered: 'actionsTriggered',
}

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
      fill: 'type',
      channels,
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
    Plot.dot(data.filter(d => d.outcome != 'success'), { 
      x: 'date', 
      y: 'duration', 
      fill: 'type',
      channels,
      tip: true      
    })
  ]
})
```

# rule executions by type

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  marks: [
    Plot.frame(),
    Plot.rectY(data, Plot.binX(
      {y: "count"}, 
      {
        x: "date", 
        fill: "type",
        channels,
        tip: true,      
      },
    )),
  ]
})
```

# rules creating alerts

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  y: { label: 'alerts created', zero: true },
  marks: [
    Plot.frame(),
    Plot.dot(data.filter(d => d.alertsNew > 0), { 
      x: 'date', 
      y: 'alertsNew', 
      fill: 'type',
      channels,
      tip: true      
    })
  ]
})
```

<!-- data as tables -->
<details><summary>data</summary>

${display(Inputs.table(data))}

</details>
