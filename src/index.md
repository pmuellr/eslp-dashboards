# eslp dashboards

This site is built with the Observable Framework, and requires the use
of `eslp` - elasticsearch local proxy.  It allows you to run dashboards
hosted in a public space, which only access data directly from the
browser.  Luckily, since you're running `elsp`, you have access to 
Elasticsearch and Kibana APIs - CORS friendly and all that.  For
multiple clusters, on the same plane of glass or quickly switchable.

For `eslp`, you will need to be running in https mode, so follow the
instructions to create an SSL certificate to use with `eslp`:

<code>https://github.com/pmuellr/eslp/tree/main/cert</code>

The code also assumes you are running `eslp` using the default port of 19200.

------------------------------------------------------------------------

| site                 | url
| ------               | -----------------------
| dev                  | https://localhost:3000
| public               | https://pmuellr.github.io/eslp-dashboards
| github               | https://github.com/pmuellr/eslp-dashboards
| eslp                 | https://github.com/pmuellr/eslp
| es\|ql               | https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html
| observable framework | https://observablehq.com/framework/

