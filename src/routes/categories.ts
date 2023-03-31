import { knex } from '../database'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`${request.method}${request.url}`)
  })
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const categories = await knex('categories')
        .where('session_id', sessionId)
        .select()
      return {
        total: categories.length,
        categories,
      }
    }
  )

  app.post('/', async (req, res) => {
    const createCategoryBodySchema = z.object({
      description: z.string(),
    })
    const { description } = createCategoryBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('categories').insert({
      description: description,
      session_id: sessionId,
    })
    return res.status(201).send({ msg: 'Categoria inserida com sucesso' })
  })
}
