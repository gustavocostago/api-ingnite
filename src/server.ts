import fastify from 'fastify'
import { knex } from './database'
import * as crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

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

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server on')
  })
