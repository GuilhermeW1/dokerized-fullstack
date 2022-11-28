import { Router, Request, Response } from 'express'
import UserController from './app/controllers/UserController'
import AuthenticateController from './app/controllers/AuthenticateController'
import authMiddleware from './app/middlewares/authMiddleware'
import TransactionController from './app/controllers/TransactionController'

const router = Router()

router.post('/authenticate', AuthenticateController.authenticate)

//username > 3 password >=8
router.post('/register', UserController.register)

router.get('/information', authMiddleware, UserController.accountInfo)

router.post('/transaction', authMiddleware, TransactionController.transaction)

router.get('/teste', (req: Request, res: Response) => {
  res.json('teste')
})

export default router
