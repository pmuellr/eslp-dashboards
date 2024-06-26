# Odds 'n Ends - ES|QL query

First, select a proxy

```js
import { getProxies } from '../components/proxy-picker.js';
import { esqlQuery } from '../components/esql.js';
const proxies = await getProxies();
```

```js
const proxy = view(Inputs.select(proxies))
```

```js
const data = await esqlQuery(proxy.es, `
  FROM .kibana-event-log-*

  | WHERE event.provider == "alerting"
  | WHERE event.action   == "execute"

  | RENAME rule.name                                                         AS  name
  | RENAME rule.category                                                     AS  rule_type
  | RENAME kibana.alert.rule.execution.metrics.total_run_duration_ms         AS  total_run_ms             
  | RENAME kibana.alert.rule.execution.metrics.total_search_duration_ms      AS  total_search_ms                

  | KEEP @timestamp, name, rule_type, total_run_ms, total_search_ms

  | LIMIT 100
`)
```

```js
Inputs.table(data)
```
