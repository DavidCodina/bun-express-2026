import { Router, type Request, type Response } from 'express'
import { codes } from '@/utils'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    codes: codes.OK,
    data: null,
    message: `You accessed the '/api/health' route! ${process.env.TEST}`,
    success: true
  })
})

export default router
