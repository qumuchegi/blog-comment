export const entriesToObj = <T>(entriesStr: string, splitChar?: string, convertValue?: (value: any) => any): T => {
  return entriesStr.split(splitChar ?? '&')
    .reduce((obj, entry) => {
      const [k, v] = entry.split('=')
      return {
        ...obj,
        [k.trim()]: convertValue ? convertValue(v) : v
      }
    }, {}) as T
}