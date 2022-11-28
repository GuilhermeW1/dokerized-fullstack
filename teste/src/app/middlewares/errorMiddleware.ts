import { Request, Response, NextFunction } from 'express'

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.json({
    status: 'Error',
    message: error.message
  })
}

export default errorMiddleware
