import { knex } from '../database'
import * as crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transaction = await knex('transactions').select('*')
    return transaction
  })

  app.post('/insert', async () => {
    const transaction = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'teste',
        amount: 2000,
      })
      .returning('*')
    return transaction
  })
}
