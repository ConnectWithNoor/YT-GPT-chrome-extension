import { OpenAI } from "openai"

const llm = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY
})

export default llm
