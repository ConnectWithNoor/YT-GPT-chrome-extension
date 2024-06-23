import { createContext, useState } from "react"

type ExtensionContextProps = {
  extensionContainer: any
  extensionIsOpen: boolean
  extensionTheme: string | null
  extensionLoading: boolean
  extensionPanel: "Summary" | "Transcript" | "Chat"
  extensionVideoId: string
  extensionData: any
}

type ExtensionContextValuesType = {
  setExtensionContainer: (container: any) => void
  setExtensionIsOpen: (isOpen: boolean) => void
  setExtensionTheme: (theme: string | null) => void
  setExtensionLoading: (loading: boolean) => void
  setExtensionPanel: (panel: "Summary" | "Transcript" | "Chat") => void
  setExtensionVideoId: (videoId: string) => void
  setExtensionData: (data: any) => void

  resetExtension: () => void
}

const initialState: ExtensionContextProps = {
  extensionContainer: null,
  extensionIsOpen: false,
  extensionTheme: null,
  extensionLoading: false,
  extensionPanel: "Summary",
  extensionVideoId: "",
  extensionData: null
}

type ExtensionProviderProps = {
  children: React.ReactNode
}

export const ExtensionContext = createContext<
  (ExtensionContextProps & ExtensionContextValuesType) | null
>(null)

export function ExtensionProvider({ children }: ExtensionProviderProps) {
  const [extensionContainer, setExtensionContainer] = useState<any>(
    initialState.extensionContainer
  )
  const [extensionIsOpen, setExtensionIsOpen] = useState<boolean>(
    initialState.extensionIsOpen
  )
  const [extensionTheme, setExtensionTheme] = useState<string | null>(
    initialState.extensionTheme
  )
  const [extensionLoading, setExtensionLoading] = useState<boolean>(
    initialState.extensionLoading
  )
  const [extensionPanel, setExtensionPanel] = useState<
    "Summary" | "Transcript" | "Chat"
  >(initialState.extensionPanel)
  const [extensionVideoId, setExtensionVideoId] = useState<string>(
    initialState.extensionVideoId
  )
  const [extensionData, setExtensionData] = useState<any>(
    initialState.extensionData
  )

  const resetExtension = () => {
    setExtensionContainer(initialState.extensionContainer)
    setExtensionIsOpen(initialState.extensionIsOpen)
    setExtensionTheme(initialState.extensionTheme)
    setExtensionLoading(initialState.extensionLoading)
    setExtensionPanel(initialState.extensionPanel)
    setExtensionVideoId(initialState.extensionVideoId)
    setExtensionData(initialState.extensionData)
  }

  return (
    <ExtensionContext.Provider
      value={{
        extensionContainer,
        extensionIsOpen,
        extensionTheme,
        extensionLoading,
        extensionPanel,
        extensionVideoId,
        extensionData,
        setExtensionContainer,
        setExtensionIsOpen,
        setExtensionTheme,
        setExtensionLoading,
        setExtensionPanel,
        setExtensionVideoId,
        setExtensionData,

        resetExtension
      }}>
      {children}
    </ExtensionContext.Provider>
  )
}
