import axios from 'axios'

const Http = {
  _get: async function<
    ReqData,
    ResData
  >(
    path: string,
    params?: ReqData
  ): Promise<ResData> {
    const res = await axios({
      method: 'GET',
      url: path,
      data: {
        ...params
      }
    })
    if (res.data.code !== 0) {
      throw null
    }
    return res.data
  },
  _post: async function<
      ReqData,
      ResData
    >(
      path: string,
      params: ReqData
  ): Promise<ResData> {
    const res = await axios(
      {
        method: 'POST',
        url: path,
        data: {
          ...params
        }
      }
    )
    if (res.data.code !== 0) {
      throw null
    }
    return res.data
  }
}

export default Http

export type BaseRes<T> = {
  code: 0 | 1,
  msg: string,
  data: T
}
