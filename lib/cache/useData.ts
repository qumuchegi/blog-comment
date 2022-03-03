const cache: Record<string, any> = {}

export default function useData<T>(key: string, fetcher: () => Promise<T>) {
  if (!cache[key]) {
    let data: T
    let promise: Promise<T>
    cache[key] = () => {
      if (data !== undefined) return data
      if (!promise) promise = fetcher().then((r) => (data = r))
      throw promise
    }
  }
  return cache[key]()
}