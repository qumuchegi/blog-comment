const cache: Record<string, any> = {}

export function useFetchData<T>(key: string, fetcher: () => Promise<T>): T {
  if (!cache[key]) {
    let data: T
    let promise: Promise<T>
    cache[key] = () => {
      if (data !== undefined) return data
      if (!promise) promise = fetcher().then((r) => (data = r))
      throw promise
    }
  }
  const temp = cache[key]()
  cache[key] = null
  return temp
}
