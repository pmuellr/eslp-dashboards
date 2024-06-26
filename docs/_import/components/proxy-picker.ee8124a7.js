/** @import * as Inputs from "@observablehq/inputs" */
import { select } from "../../_node/@observablehq/inputs@0.10.6/index.js";

export async function createProxyPicker() {
  const proxies = await getProxies()

  const input = select(proxies, {
    label: 'Proxy',
  })

  return input
}

/** @type { () => Promise<Map<string, Proxy>> } */
export async function getProxies() {
  const request = await fetch('https://proxy.eslp.local:19200/index.json')
  const response = await request.json()
  const servers = response.servers || []

  /** @type { Map<string, Proxy> } */
  const result = new Map()
  for (const server of servers) {
    result.set(server.name, server)
  }
  return result
}