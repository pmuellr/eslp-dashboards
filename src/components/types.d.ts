interface Proxy {
  name: string
  es:   string
  kb:   string
}

interface EsqlResponse {
  columns: { name: string, type: string }[]
  values: unknown[][]
}

type TidyData = Record<string, unknown>[]

type Comparator<T=unknown> = (a: T, b: T) => number

declare module "@observablehq/inputs" {
  interface SelectOptions<T=string> {
    label?: string | HTMLElement
    multiple?: boolean
    size?: number
    sort?: boolean | string | Comparator
    unique?: boolean
    locale?: string
    format?: () => string
    keyof?: (data: T) => string
    valueof?: (data: T) => T
    value?: T
    width?: number
    disabled?: false | unknown[]
  }
  export function select<T=string>(data: T[] | Map<string, T>, options?: SelectOptions<T>): HTMLElement
}