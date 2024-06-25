import { useExtension } from "@/hooks/use-context"
import { cleanJSONTranscript } from "@/utils/helpers"
import { createContext, useMemo, useState } from "react"

type TranscriptContextProps = {
  transcriptSearch: string
  setTranscriptSearch: (search: string) => void
  transcriptJSON: Transcript[]
}

export const TranscriptContext = createContext<TranscriptContextProps | null>(
  null
)

type TranscriptProviderProps = {
  children: React.ReactNode
}

export function TranscriptProvider({ children }: TranscriptProviderProps) {
  const [transcriptSearch, setTranscriptSearch] = useState<string>("")

  const { extensionLoading, extensionData } = useExtension()

  const transcriptJSON = useMemo(() => {
    if (!extensionLoading && extensionData && extensionData.transcript) {
      return cleanJSONTranscript(extensionData.transcript) // this function is used to clean the transcript data to be used in the transcript tab
    }

    return []
  }, [extensionData, extensionLoading])

  return (
    <TranscriptContext.Provider
      value={{
        setTranscriptSearch,
        transcriptSearch,
        transcriptJSON
      }}>
      {children}
    </TranscriptContext.Provider>
  )
}
