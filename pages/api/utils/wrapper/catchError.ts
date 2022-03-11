import { NextApiRequest, NextApiResponse } from 'next'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export default function catchError(
  apiHandler: ApiHandler,
  errHandler?: (err: any) => void
): ApiHandler {
  return async (req, res) => {
    try {
      await apiHandler(req, res)
    } catch (err) {
      errHandler?.(err)
      // console.error(req.url, err)
      res.status(500)
      .json({
        code: 1,
        msg: 'server error',
        data: null,
        path: req.url,
        error: err
      })
    }
  }
}