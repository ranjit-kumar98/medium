
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from 'ranjit123-tsb-common-app'


export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    SECRET_KEY: string
	}
}>();
//POST/api/v1/user/signup
userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  //@ts-ignore
    const body = await c.req.json();

    const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name:body.name
        }
      })
  
      const jwt = await sign ({id:user.id}, "secret")
  
      return c.json({
        token: jwt,
        message: "user signed up",
        status: 200
      });
    }
    catch (e) {
      c.status(403);
      return c.json({
        status: 403,
        message: "some error occured",
        error:e
      })
    }
    
  })
  
  //POST /api/v1/user/signin
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  
  const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  const user = await prisma.user.findUnique({
    where:{
      email: body.email,
      password: body.password
    }
  })
  
  if(!user)
    {
      c.status(403);
      return c.json({
        message:"user is not found",
        status:403
      })
    }
  
    const jwt = await sign({id: user.id}, "secret")
  
  
    return c.json({
      message: 'user signed in',
      status:200,
      token: jwt
    })
  })