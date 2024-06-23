import { ExtensionProvider } from "@/context/extension-context"
import React from "react"

type Props = { children: React.ReactNode }

function Provider({ children }: Props) {
  return <ExtensionProvider>{children}</ExtensionProvider>
}

export default Provider
