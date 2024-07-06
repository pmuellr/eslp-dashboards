# Logs

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
FROM logging-*:logs-proxy*
| WHERE @timestamp > NOW() - ${lookBackMin} minutes
| WHERE response_length > 5000000

| RENAME @timestamp          AS date
| RENAME request_length      AS requestLength
| RENAME response_length     AS responseLength
| RENAME request_path        AS path
| RENAME x_opaque_id         AS opaqueId
| RENAME user_agent.original AS userAgent

| KEEP date, requestLength, responseLength, path, opaqueId, userAgent

| SORT date desc
| LIMIT 1000
`.trim()
```

```js
const data = await esqlQuery(proxy.es, query)
const channels = {
  date: 'date',
  path: 'path',
  requestLength: 'requestLength',
  responseLength: 'responseLength',
  opaqueId: 'opaqueId',
}

```
   
# response length by path

```js
Plot.plot({
  grid: true,
  height: 300,
  color: { legend: true },
  y: { label: 'response length' },
  marks: [
    Plot.frame(),
    Plot.dot(data, { 
      x: 'date', 
      y: 'responseLength', 
      fill: 'path',
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
