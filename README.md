# eslp Dashboards

Dashboards for Elasticsearch built with the 
[Observable Framework](https://observablehq.com/framework), using ES|QL,
accessing clusters via [`eslp`](https://github.com/pmuellr/eslp) and using
[Observable Plot](https://observablehq.com/plot/) for visualizations.

The dashboards are hosted live at https://pmuellr.github.io/eslp-dashboards
, however you will have to have `eslp` set up to view any data.

The files in `src` are the source files; the files in `docs` are the
compiled output of the site.

In the movie below, I select three proxies/clusters to view in the same dashboard
using Observable Plot faceting.  I extend the time range and bit and then
the graphs shrink down because of an outlier in one of the clusters.
I attempt to disable that cluster from the picker, but get it wrong the
first time ... eventually only showing the two clusters without the outlier.  
Then it scrolls down to some of the other graphs.

https://github.com/pmuellr/eslp-dashboards/assets/25117/017006b4-e18d-4803-b633-1449cfc41a42

## observations

This is kind of a dream project for me.  I love wiki's, JavaScript, the web, data,
wonky networking for "debugging".  Especially since I can "eat my own dog food"
by creating stuff that digests the data my code pumps out.  Is it useful?  

I'll go through some of the parts ...

### overall

I was thinking a story like this might be a nice way to contain a set
of specific dashboards in a nice way.  Especially considering the
ability to get data from multiple clusters easily.

And it is fairly easy to take some nicely post-formatted data,
pass it to `Plot.something()` and see a nice visualization.

But I'm immediately missing the time picker, which sometimes seems so
wonky in Kibana, but works well for simple things - "last 24 hours"
as an example.  Filter buttons, easily diabled / inverted.

### eslp

https://github.com/pmuellr/eslp

This project greatly simplifies something we don't think about as tool
creators.  Logging in is hard.

If I wanted to use a real database in something like an 
[Observable Notebook](https://observablehq.com/documentation/),
I think you could, though it 
[seems fairly complicated](https://observablehq.com/documentation/data/databases/overview).
Having to give a server somewhere credentials to a resouce should always be scary.

`eslp` makes it much simpler.  Run it, and you'll have an authentication-free,
CORS-friendly, localhost-only channel to your Elasticsearch clusters (and
Kibana apps).  Anything that can issue an HTTP request to locahost can 
access your data.  So, a web app can.

I had to make one change to `eslp` this week.  It supports a special hostname
and route to return the urls serving as a proxies.  But it didn't set
CORS headers, so it couldn't be accessed when the app was hosted at
Github Pages.  Simple fix, and other than, worked without a blip all
week.

### ES|QL

I decided I'd just use 
[ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html)
for my queries for this project.

A breath of fresh air!

I keep the queries in the markdown files, which makes sense since they
are so specific to them.  

The biggest issue I found was with Cross Cluster Search (CCS).  I wanted
to access some of our CCS resouces, but found it unbelievably slow, 
even with a `LIMIT 10` on them, and date range filters.  Kinda scary.
Decided I didn't want to affect some potentially rando clusters, so
I focused on accessing the Kibana Event Log for the data.

The data format produced by the query is less than optimal for usage
in Plot and Vega Lite.  Both of those libraries expect arrays of 
objects where the columns are represented as key/value pairs, rather
than with ES|QL producing an array of values and separate array of
column info.  Having to do this transition for every row pains me,
especially when I use `LIMIT 10000`.  I think it should be considered
as an additional output format, called, apparently, "Tidy Data".

The only other niggle I have with ES|QL - so I love it - is the reverse
naming of the parms for `EVAL` and `RENAME`.  I stack these together
as common "rename / massage existing data" sections that look like this:

```
...
| EVAL duration = ROUND(event.duration / 1000000000.0, 3)
| EVAL delay    = ROUND(kibana.task.schedule_delay / 1000000000.0, 3)

| RENAME event.start   AS date
| RENAME event.outcome AS outcome
| RENAME rule.id       AS id
| RENAME rule.name     AS name
| RENAME rule.category AS type
...
```

It bugs me that the "new" name is on the left for `EVAL`, but on the
right for `RENAME`.  There should be a `RENAME x FROM y` option
to let me change the name order.

### Observable Framework

https://observablehq.com/framework/

Quite nice!

I've been playing with the Observable Runtime for a while, hoping to
build or find an environment like this.  

And I actually tried something
like this, where you code in Markdown and your JavaScript is in
fenced (triple backtic'd) js code blocks.  The big problem with this is that
there is **NO** Javacript typing help here, as expected.  But I 
just can't live that way.

Ideally then you'd just declare your top-level variables (Observable
Runtime variables), and then call a single function with them.  Moving
the meat of the JS code to `.js` files where you'll get all the great
typing back.  

It's hard.  So easy to add just abit more JS to your markdown ...

And for the Observable Plot library, to some extent doesn't make sense
to move that code to `.js` files, since AFAICT there is no way to get
typing help for that, in any case.

### Observable Plot

https://observablehq.com/plot/

I had been thinking that `Plot` might be a competitor to "Vega Lite",
but no.  It's great for doing basic charting, but doesn't seem to
be anywhere close to Vega Lite, especially with interactions.

Good to know, because it IS easy to do simple charts, it's just 
hard-to-impossible to do anything that's not simple.

The lack of interactivity is hard on me, as well.

Also, there don't seem to be any good ways to get typing in this
library.  I had to add some to a `.d.ts` file for some at least
basic help.