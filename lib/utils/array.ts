export const flatArr = <T>(arr: T[]): Array<T> => {
  return arr.reduce<T[]>((flated, item) => {
    if (Array.isArray(item)) {
      return [...flated, ...flatArr(item)]
    } else {
      return [...flated, item]
    }
  }, [])
}

export const sortObjArr = <T extends Record<string, any>>(
  arr: T[],
  {
    sortField,
    convertSortFieldValue,
    order
  }: {
    sortField: string,
    convertSortFieldValue?: (value: any) => any
    order: any[]
  }
  ): T[] => {
    const orderMapToIndex = order.reduce((obj, item, index) => {
      return {
        ...obj,
        [item]: index
      }
    }, {})
    const arrWithIndex = arr.map(item => {
      return {
        ...item,
        ['_orderHelperKey']: orderMapToIndex[convertSortFieldValue?.(item[sortField]) ?? item[sortField]]
      }
    })
    return arrWithIndex.sort((a, b) => {
      return a['_orderHelperKey'] - b['_orderHelperKey']
    })
}