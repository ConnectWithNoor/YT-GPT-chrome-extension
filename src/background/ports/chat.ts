import llm from "@/lib/openai";
import { CHAT_SYSTEM_PROMPT, models } from "@/utils/constants";

import type { PlasmoMessaging } from "@plasmohq/messaging";

async function createCompletion(model: string, messages: any[], context: any) {
  // parsing the transcript from json3 format to plain text (check getVideoData function in helper.ts)
  const parsed = context.transcript.events
    .filter((x: { segs: any }) => x.segs)
    .map((x: { segs: any }) => x.segs.map((y: { utf8: any }) => y.utf8))
    .join(" ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");

  const SYSTEM_WITH_CONTEXT = CHAT_SYSTEM_PROMPT.replace(
    "{title}",
    context.metadata.title
  ).replace("{transcript}", parsed);

  messages.unshift({ role: "system", content: SYSTEM_WITH_CONTEXT });

  return llm.beta.chat.completions.stream({
    messages: messages,
    model: model || models[0].content,
    stream: true
  });
}

// https://docs.plasmo.com/framework/messaging#ports

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  let cumulativeData = "";

  const messages = req.body.messages;
  const model = req.body.model;
  const context = req.body.context;

  try {
    const completion = await createCompletion(model, messages, context);

    completion.on("content", (delta, _snapshot) => {
      cumulativeData += delta; // appending the content coming from openAI to cumulativeData
      res.send({ message: cumulativeData, error: "", isEnd: false });
    });

    completion.on("end", () => {
      res.send({ message: "END", error: null, isEnd: true });
    });
  } catch (_) {
    const error = _ as Error;
    console.log("🚀 ~ handler: chat.ts line#50 = ~ error:", error);

    res.send({ error: "Something went wrong" });
  }
};

export default handler;
