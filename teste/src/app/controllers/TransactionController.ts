import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { v4 } from 'uuid'

interface IBalance {
  account: string
  balance: string
}

class TransactionController {
  async transaction(req: Request, res: Response) {
    const currentUserId = req.userId
    const { requestCreditedUser, value } = req.body

    const parsedValue = parseFloat(value)

    if (!requestCreditedUser) {
      throw new Error('Missed user to transfer')
    }

    const prisma = new PrismaClient()

    const creditedUserExists = await prisma.users.findUnique({
      where: { username: requestCreditedUser }
    })

    if (!creditedUserExists) {
      throw new Error('User does not exists')
    }

    const debitedUserInfo: IBalance[] = await prisma.$queryRaw`
      select  a.id as account, a.balance
      from users u, accounts a
      where u."accountId" = a.id
      and u.id = ${currentUserId}
    `
    const creditedUserInfo: IBalance[] = await prisma.$queryRaw`
      select a.id as account, a.balance
      from users u, accounts a
      where u."accountId" = a.id
      and u.id = ${creditedUserExists.id}
    `

    const debitedBalanceCurrent: number = parseFloat(debitedUserInfo[0].balance)
    const creditedBalanceCurrent: number = parseFloat(
      creditedUserInfo[0].balance
    )

    if (parsedValue > debitedBalanceCurrent) {
      throw new Error('Insufficient balance')
    }

    const debitedUserNewBalance: number = debitedBalanceCurrent - parsedValue
    const creditedUserNewBalance: number = creditedBalanceCurrent + parsedValue

    //for some reason the default(uuid()) isnt work as well on the table transactions
    const insertedValue = parsedValue + '' // it is to turn the value into a string
    const id = v4()

    try {
      await prisma.$transaction([
        prisma.transactions.create({
          data: {
            id,
            debitedAccountId: debitedUserInfo[0].account,
            creditedAccountId: creditedUserInfo[0].account,
            value: insertedValue
          }
        }),

        prisma.$queryRaw`
        update accounts
        set balance = ${debitedUserNewBalance}
        where id = ${debitedUserInfo[0].account}
      `,

        prisma.$queryRaw`
        update accounts
        set balance = ${creditedUserNewBalance}
        where id = ${creditedUserInfo[0].account}
      `
      ])
    } catch (error: any) {
      throw new Error(`Error ${error}`)
    }

    return res.status(202).json({ message: 'Transection done' })
  }
}

export default new TransactionController()
