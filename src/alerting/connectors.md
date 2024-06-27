# Connectors

Select a proxy:

```js
import { getProxies } from '../components/proxy-picker.js';
import { esqlQuery } from '../components/esql.js';
const proxies = await getProxies();
const proxy = view(Inputs.select(proxies))
```

```js
const query = `
FROM .kibana-event-log-*
| WHERE @timestamp > NOW() - 240 hour
| WHERE event.provider == "actions"
| WHERE event.action   == "execute"

| EVAL duration    = ROUND(event.duration / 1000000000.0, 3)
| EVAL delay       = ROUND(kibana.task.schedule_delay / 1000000000.0, 3)

| RENAME error.message      AS errorMessage
| RENAME event.start        AS date
| RENAME event.outcome      AS outcome
| RENAME kibana.action.id   AS connId
| RENAME kibana.action.name AS name

| KEEP message, date, outcome, duration, delay, name, connId, errorMessage

| SORT date desc
| LIMIT 5000
`.trim()
```

```js
const data = await esqlQuery(proxy.es, query)
const failData = data.filter(d => d.outcome != 'success')
const channels = {
  message: 'message',
  date: 'date',
  outcome: 'outcome',
  duration: 'duration',
  delay: 'delay',
  name: 'name',
  connId: 'connId',
  errorMessage: 'errorMessage',
}
```
   
# connector duration by name

Note, connector type is **NOT** available in the event log!

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
      fill: 'name',
      channels,
      tip: true      
    })
  ]
})
```

# connector errors by name

Note, connector type is **NOT** available in the event log!

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  y: { label: 'duration (seconds)' },
  marks: [
    Plot.frame(),
    Plot.dot(failData, { 
      x: 'date', 
      y: 'duration', 
      fill: 'name',
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
