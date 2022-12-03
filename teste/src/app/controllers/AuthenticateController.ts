import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

interface ILogin {
  username: string
  password: string
}

class AuthenticateController {
  async authenticate(req: Request, res: Response) {
    const prisma = new PrismaClient()

    const { username, password } = req.body as ILogin

    if (!username || !password) {
      throw new Error('User and password required')
    }

    const userAlreadyExists = await prisma.users.findFirst({
      where: { username }
    })

    if (!userAlreadyExists) {
      throw new Error('User or password incorrect!')
    }

    const passwordMatches = await bcrypt.compare(
      password,
      userAlreadyExists.password
    )

    if (!passwordMatches) {
      throw new Error('User or password incorrect!')
    }

    const token = jwt.sign({ id: userAlreadyExists.id }, 'my-secret', {
      expiresIn: '1d'
    })

    const user = userAlreadyExists
    return res.json({ user, token })
  }
}

export default new AuthenticateController()
