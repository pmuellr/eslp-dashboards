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
const queryDefault = `
FROM .kibana-event-log-*

| WHERE event.provider == "alerting"
| WHERE event.action   == "execute"

| RENAME rule.name                                                    AS  name
| RENAME rule.category                                                AS  rule_type
| RENAME kibana.alert.rule.execution.metrics.total_run_duration_ms    AS total_run_ms             
| RENAME kibana.alert.rule.execution.metrics.total_search_duration_ms AS total_search_ms                

| KEEP @timestamp, name, rule_type, total_run_ms, total_search_ms

| LIMIT 100
`.trim()

const query = view(Inputs.textarea({
  label: 'query',
  value: queryDefault,
  spellcheck: false,
  autocomplete: false,
  autocapitalize: false,
  width: '100%',
  rows: 16,
  resize: true,
  submit: true,
  readonly: false,
  disabled: false,
  monospace: true,
}))
```

```js
let data
try {
  data = await esqlQuery(proxy.es, query)
  display(Inputs.table(data))
} catch(e) {
  display(html`<code>error: ${e.message}</code>`)
}
```
