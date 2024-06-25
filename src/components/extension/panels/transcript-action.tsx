import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useExtension, useTranscript } from "@/hooks/use-context"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cleanTextTranscript } from "@/utils/helpers"
import {
  CheckIcon,
  ClipboardCopyIcon,
  Crosshair1Icon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons"
import React from "react"

import TooltipWrapper from "../tooltip-wrapper"

type Props = {
  jumpToCurrentTime: () => void
}

function TranscriptAction({ jumpToCurrentTime }: Props) {
  const { setTranscriptSearch, transcriptSearch, transcriptJSON } =
    useTranscript()
  const { extensionLoading, extensionData } = useExtension()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const copyTranscript = () => {
    if (isCopied || !extensionData.transcript) return

    const processed = cleanTextTranscript(extensionData.transcript)
    copyToClipboard(processed)
  }

  return (
    <div className="flex flex-row w-full  justify-between items-center sticky top-0 z-10 bg-white pt-3.5 pb-3 px-3 space-x-4 dark:bg-[#0f0f0f]">
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
        <Input
          type="text"
          placeholder="Search Transcript"
          className="pl-8"
          onChange={(e) => {
            e.preventDefault()
            setTranscriptSearch(e.currentTarget.value)
          }}
          disabled={extensionLoading || transcriptJSON.length <= 0}
        />
      </div>

      <div className="flex flex-row space-x-2">
        <TooltipWrapper text="Jump to current Time">
          <Button
            variant="outline"
            size="icon"
            onClick={jumpToCurrentTime}
            disabled={extensionLoading || transcriptJSON.length <= 0}>
            <Crosshair1Icon className="h-4 w-4 opacity-60" />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper text="Copy Transcript">
          <Button
            variant="outline"
            size="icon"
            onClick={copyTranscript}
            disabled={extensionLoading || transcriptJSON.length <= 0}>
            {isCopied ? (
              <CheckIcon className="h-4.5 w-4.5 opacity-60" />
            ) : (
              <ClipboardCopyIcon className="h-4.5 w-4.5 opacity-60" />
            )}
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  )
}

export default TranscriptAction
