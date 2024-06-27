# Overview

These dashboards are for the Overview clusters and 
expect the following proxy names to be available:

- `overview-pr` - proxy for the production Overview cluster
- `overview-st` - proxy for the staging Overview cluster
- `overview-qa` - proxy for the qa Overview cluster

For instance, here are some stanzas for `eslp.toml`; contact me if
you need the actual URLs - they can be hard to track down and QA is
extra squirrelly!

```toml
[[server]]
name   = "overview-pr"
es     = "https://example.com"
kb     = "https://example.com"
apiKey = "yeah,right!"

[[server]]
name   = "overview-st"
es     = "https://example.com"
kb     = "https://example.com"
apiKey = "yeah,right!"

# deployment in QA, named "overview.qa.cld.elstc.co"
[[server]]
name   = "overview-qa"
es     = "https://example.com"
kb     = "https://example.com"
apiKey = "yeah,right!"
```
