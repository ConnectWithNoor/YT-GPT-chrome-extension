import llm from "@/lib/openai"
import { models } from "@/utils/constants"

import type { PlasmoMessaging } from "@plasmohq/messaging"

async function createCompletion(model: string, prompt: string, context: any) {
  // parsing the transcript from json3 format to plain text (check getVideoData function in helper.ts)
  const parsed = context.transcript.events
    .filter((x: { segs: any }) => x.segs)
    .map((x: { segs: any }) => x.segs.map((y: { utf8: any }) => y.utf8))
    .join(" ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")

  const USER = `${prompt}
  
  Video Title: ${context.metadata.title}
  Transcript: ${parsed}`

  return llm.beta.chat.completions.stream({
    messages: [{ role: "user", content: USER }],
    model: model || models[0].content,
    stream: true
  })
}

// https://docs.plasmo.com/framework/messaging#ports

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  let cumulativeData = ""

  const prompt = req.body.prompt
  const model = req.body.model
  const context = req.body.context

  try {
    const completion = await createCompletion(model, prompt, context)

    completion.on("content", (delta, _snapshot) => {
      cumulativeData += delta // appending the content coming from openAI to cumulativeData
      res.send({ message: cumulativeData, error: "", isEnd: false })
    })

    completion.on("end", () => {
      res.send({ message: "END", error: "", isEnd: true })
    })
  } catch (_) {
    const error = _ as Error
    console.log("🚀 ~ handler: competion.ts line#50 = ~ error:", error)

    res.send({ error: "Something went wrong" })
  }
}

export default handler
