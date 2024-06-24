import { SummaryContext } from "@/context/summary-context"
import { useContext } from "react"

export function useSummary() {
  const context = useContext(SummaryContext)

  if (!context) {
    throw new Error("useSummary must be used within an ExtensionProvider")
  }

  return context
}
