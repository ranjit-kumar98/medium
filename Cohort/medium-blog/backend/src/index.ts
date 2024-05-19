import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { userRouter } from '../routes/user';
import { blogRouter } from '../routes/blog';
import { cors } from 'hono/cors'



export const  app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    SECRET_KEY: string
	}
}>();

app.use('/*', cors())

//server test
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
///api/v1/user -> routes
app.route('/api/v1/user', userRouter)

///api/v1/blog
app.route('/api/v1/blog', blogRouter)

export default app
