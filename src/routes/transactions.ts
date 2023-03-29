import { knex } from '../database'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()
    return {
      total: transactions.length,
      transactions,
    }
  })

  app.get('/:id', async (req) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionsParamsSchema.parse(req.params)
    const transaction = await knex('transactions').where('id', id).first()
    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { title, amount, type } = createTransactionBodySchema.parse(req.body)
    await knex('transactions').insert({
      id: randomUUID(),
      title: title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return res.status(201).send({ msg: 'Inserido com sucesso' })
  })
}
