import { NextApiRequest, NextApiResponse } from 'next'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export default function catchError(
  apiHandler: ApiHandler
): ApiHandler {
  return async (req, res) => {
    try {
      apiHandler(req, res)
    } catch (err) {
      res.status(500)
      .json({
        code: 1,
        msg: 'server error',
        data: null
      })
    }
  }
}