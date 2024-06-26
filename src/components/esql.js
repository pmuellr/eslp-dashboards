/** @type { (url: string, query: string) => Promise<TidyData> } */
export async function esqlQuery(url, query) {
  const response = await esqlQueryRaw(url, query)
  return esqlResponseAsTidyData(response)
}

/** @type { (url: string, query: string) => Promise<EsqlResponse> } */
async function esqlQueryRaw(url, query) {
  const response = await fetch(`${url}/_query`, {
    method: "POST",
    body: JSON.stringify({ query: query }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json()
}

/** @type { (esqlResponse: EsqlResponse) => TidyData } */
function esqlResponseAsTidyData(esqlResponse) {
  const names = esqlResponse.columns.map(c => c.name)
  
  return esqlResponse.values.map(value => {
    /** @type { Record<string, unknown> } */
    const obj = {}
    for (let i = 0; i < names.length; i++) {
      obj[names[i]] = value[i]
    }
    return obj
  })
}
