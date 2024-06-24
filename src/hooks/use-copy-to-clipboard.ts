import { useState } from "react"

type props = {
  timeout?: number
}

export function useCopyToClipboard({ timeout = 2000 }: props = {}) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (url: string) => {
    if (typeof window === "undefined" || !navigator.clipboard || !url) {
      return
    }

    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}
