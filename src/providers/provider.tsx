import { ExtensionProvider } from "@/context/extension-context"
import { SummaryProvider } from "@/context/summary-context"
import React from "react"

type Props = { children: React.ReactNode }

function Provider({ children }: Props) {
  return (
    <ExtensionProvider>
      <SummaryProvider>{children}</SummaryProvider>
    </ExtensionProvider>
  )
}

export default Provider
