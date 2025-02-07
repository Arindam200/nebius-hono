import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { env } from 'hono/adapter'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import OpenAI from 'openai'
import { renderer } from './renderer'

const app = new Hono()


app.onError((err, c) => {
  console.error('Global error:', err)
  return c.text("Internal Server Error", 500)
})

app.use(logger())

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })
  )
})





app.post('/api/chat', zValidator('json', schema), async (c) => {
  try {
    const { messages } = c.req.valid('json')

    const NEBIUS_API_KEY = env<{ NEBIUS_API_KEY: string }>(c).NEBIUS_API_KEY || import.meta.env.VITE_NEBIUS_API_KEY

    if (!NEBIUS_API_KEY) {
      throw new Error("NEBIUS_API_KEY is not defined! Please set NEBIUS_API_KEY in your environment.")
    }

    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.ai/v1/",
      apiKey: NEBIUS_API_KEY,
    })

    

    const result = await client.chat.completions.create({
      temperature: 0.6,
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
      messages: messages,
      // stream:true, // TBD
    })


    if (!result.choices || result.choices.length === 0 || !result.choices[0].message) {
      return c.text("No valid response from AI", 500)
    }

    return c.text(result.choices[0].message.content ?? "")
  } catch (error) {
    console.error("Error in /api/chat:", error)
    return c.text("Error processing request", 500)
  }
})

app.get('*', renderer, async (c) => {
  return c.render(<div id="root"></div>)
})

export default app
