import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface ItokenPayload {
  id: string
  iat: number
  exp: number
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization

  if (!authToken) {
    throw new Error('invalid token')
  }

  const token = authToken.replace('Bearer', '').trim()

  try {
    //verifica o token
    const data = jwt.verify(token, 'my-secret')
    //manda o id do usuario via request
    const { id } = data as ItokenPayload
    req.userId = id
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export default authMiddleware
