import { it, beforeAll, afterAll, describe } from 'vitest'
import { app } from '../app'
import request from 'supertest'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 200,
        type: 'credit',
      })
      .expect(201)
  })
  it.todo('should be able to list all transaction', async () => {})
})
