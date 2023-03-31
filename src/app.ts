import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
import { categoriesRoutes } from './routes/categories'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
app.register(categoriesRoutes, {
  prefix: 'categories',
})
