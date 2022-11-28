import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

interface IRegister {
  username: string
  password: string
}

interface IBalance {
  balance: string
}

class UserController {
  /**
   * register creates the account and the user
   */
  async register(req: Request, res: Response) {
    const { username, password } = req.body as IRegister

    if (username.length < 3) {
      throw new Error('username too short')
    }

    if (password.length < 8) {
      throw new Error('Password too short')
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must have capital letter')
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Password must have some number')
    }

    const prisma = new PrismaClient()

    let prismaUser = undefined
    try {
      prismaUser = await prisma.users.findFirst({ where: { username } })
    } catch (error: any) {
      throw new Error('Error to find user - register')
    }

    if (prismaUser) {
      return res.status(400).send('User already exists')
    }

    //this create a primary key to be shared tween account and user
    const accountId = v4()

    const hashedPassword = await bcrypt.hash(password, 8)

    const transactionQuery = await prisma.$transaction([
      prisma.accounts.create({
        data: {
          id: accountId,
          balance: 100.0
        }
      }),
      prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          accountId: accountId
        }
      })
    ])

    return res.json(transactionQuery[1]) //the transactionQuery hav the array of account and users -- [1] selects users
  }

  async accountInfo(req: Request, res: Response) {
    const userId = req.userId
    const prisma = new PrismaClient()

    const dbBalance: IBalance[] = await prisma.$queryRaw`
      select a.balance
      from users u, accounts a
      where u."accountId" = a.id
      and u.id = ${userId}
    `

    //esse deve tar errado
    const transactions = await prisma.$queryRaw`
        select t.id, t."debitedAccountId", t."creditedAccountId", t.value, t."createdAt"
        from transactions t, users u, accounts a
        where u."accountId" = a.id
        and a.id = t."debitedAccountId"
        and u.id = ${userId}

        union

        select t.id, t."debitedAccountId", t."creditedAccountId", t.value, t."createdAt"
        from transactions t, users u, accounts a
        where u."accountId" = a.id
        and a.id = t."creditedAccountId"
        and u.id = ${userId}
        
    `
    const balance = dbBalance[0].balance

    const informations = {
      balance,
      transactions
    }

    return res.json(informations)
  }
}

export default new UserController()
