import { ExtensionContext } from "@/context/extension-context"
import { useContext } from "react"

export function useExtension() {
  const context = useContext(ExtensionContext)

  if (!context) {
    throw new Error("useExtension must be used within an ExtensionProvider")
  }

  return context
}
