import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { use } from 'hono/jsx';
import { createPostInput, updatePostInput } from 'ranjit123-tsb-common-app';


export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    SECRET_KEY: string
	},
    Variables: {
        userId: string
    }
}>();


//middleware
blogRouter.use('/*', async (c, next) => {
    
	const jwt = c.req.header('authorization');

    
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
   
	const token = jwt;
	const payload = await verify(token, "secret");
   
    
	if (!payload) {
		c.status(401);
        
		return c.json({ error: "unauthorized" });
	}
	c.set("userId", payload.id);  
	await next();
})
  
  //POST /api/v1/blog
  blogRouter.post('/create', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    
    const body = await c.req.json()

    const { success } = createPostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    try {
        
        const userid = c.get('userId');
    
    

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userid
        }
    })
    
    
    return c.json(
      {
        message: 'post created',
        status:200,
        blog
      }
    )
        
    } catch (e) {
           
        c.status(403)
        return c.json({
            status: 403,
            message: 'post not created. try again or check if you are logged in or not.'
        })
    }
    
  })
  
  //PUT /api/v1/blog
  blogRouter.put('/update', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
	const { success } = updatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    try {

        const userid = c.get('userId');

    const blog = await prisma.post.update({
        where: {
            id: body.id, //blog id
            authorId:userid
        },
        data: {
            title: body.title,
            content: body.content,
            authorId: userid
        }
    })
    
    return c.json(
      {
        message: 'post updated',
        status:200,
        blogid: blog.id
      }
    )
        
    } catch (e) {
        c.status(403)
        c.json({
            status: 403,
            message: 'post could not updated. try again or check if you are logged in or not.'
        })
    }
   
  })

    //GET/api/v1/blog/bulk
    blogRouter.get('/bulk', async (c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        
        try {
            const post = await prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    content:true,
                    published:true,
                    author : true,
                    authorId: true
                }
            });
            return c.json({
                post,
                message: "all blogs fetched",
                status:200
            });
        } catch (error) {
            c.status(403)
            c.json({
                status: 403,
                message: "could not fetch. please try again later!!",
                error: error
            })
        }
    
      })
      
  //GET/api/v1/blog/:id
  
  blogRouter.get('/:id', async (c) => {
  
    const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
    try {
        const post = await prisma.post.findUnique({
            where: {
                id //blog id
            },
            select: {
                id:true,
                content:true,
                title:true,
                author: {
                    select: {
                        name:true
                    }
                }
            }
        });
    
        return c.json(post);
    } catch (error) {
        c.status(403)
        c.json({
            status: 403,
            message: "could not fetch. please try again later!!"
        })
    }

  })
