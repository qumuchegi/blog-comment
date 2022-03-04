import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://blog-comment-mocha.vercel.app/'
const Http = {
  _get: async function<
    ReqData extends Object,
    ResData
  >(
    path: string,
    params?: ReqData
  ): Promise<ResData> {
    //+ '?' + Object.entries(params).map(([k ,v]) => `${k}=${v}`).join('&')
    const res = await axios({
      url: BASE_URL + path,
      method: 'GET',
      params
    }
    )
    if (res.data.code !== 0) {
      throw null
    }
    return res.data.data
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
        url: BASE_URL + path,
        data: {
          ...params
        }
      }
    )
    if (res.data.code !== 0) {
      throw null
    }
    return res.data.data
  }
}

export default Http

export type BaseRes<T> = {
  code: 0 | 1,
  msg: string,
  data: T
}
