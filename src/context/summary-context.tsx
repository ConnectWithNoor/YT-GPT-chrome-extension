import { useExtension } from "@/hooks/use-context"
import { models, prompts } from "@/utils/constants"
import { createContext, useEffect, useState } from "react"

import { usePort } from "@plasmohq/messaging/hook"

type SummaryContextProps = {
  summaryModel: Model
  setSummaryModel: (model: Model) => void

  summaryPrompt: Prompt
  setSummaryPrompt: (prompt: Prompt) => void

  summaryContent: string | null
  setSummaryContent: (content: string | null) => void

  summaryIsError: boolean
  setSummaryIsError: (isError: boolean) => void

  summaryIsGenerating: boolean
  setSummaryIsGenerating: (isGenerating: boolean) => void

  generateSummary: (e: any) => void
}

type SummaryProviderProps = {
  children: React.ReactNode
}

export const SummaryContext = createContext<SummaryContextProps | null>(null)

export function SummaryProvider({ children }: SummaryProviderProps) {
  const [summaryModel, setSummaryModel] = useState<Model>(models[0])
  const [summaryPrompt, setSummaryPrompt] = useState<Prompt>(prompts[0])
  const [summaryContent, setSummaryContent] = useState<string | null>(null)
  const [summaryIsError, setSummaryIsError] = useState<boolean>(false)
  const [summaryIsGenerating, setSummaryIsGenerating] = useState<boolean>(false)

  const port = usePort("completion")
  const { extensionData, extensionLoading } = useExtension()

  const generateSummary = async (e: any) => {
    e.preventDefault()

    if (summaryContent !== null) {
      setSummaryContent(null)
    }

    setSummaryIsGenerating(true)
    setSummaryIsError(false)

    port.send({
      prompt: summaryPrompt.content,
      model: summaryModel.content,
      context: extensionData
    })
  }

  useEffect(() => {
    setSummaryContent(null)
    setSummaryIsError(false)
    setSummaryIsError(false)
  }, [extensionLoading])

  return (
    <SummaryContext.Provider
      value={{
        summaryModel,
        setSummaryModel,
        summaryPrompt,
        setSummaryPrompt,
        summaryContent,
        setSummaryContent,
        summaryIsError,
        setSummaryIsError,
        summaryIsGenerating,
        setSummaryIsGenerating,
        generateSummary
      }}>
      {children}
    </SummaryContext.Provider>
  )
}