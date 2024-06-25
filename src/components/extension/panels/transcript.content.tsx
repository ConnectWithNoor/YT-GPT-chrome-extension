import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useExtension, useTranscript } from "@/hooks/use-context"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CheckIcon, ClipboardCopyIcon, ClockIcon } from "@radix-ui/react-icons"
import React, { memo, useMemo } from "react"

import TooltipWrapper from "../tooltip-wrapper"

type TranscriptContentProps = {
  ref: React.Ref<HTMLDivElement>
}

type TranscriptItemProps = {
  item: Transcript
  searchInput: string
}

type TranscriptListProps = {
  transcript: Transcript[]
  searchInput: string
}

const TranscriptContent = React.forwardRef<
  HTMLDivElement,
  TranscriptContentProps
>((props, ref) => {
  const { transcriptJSON, transcriptSearch } = useTranscript()
  const { extensionLoading, extensionData } = useExtension()

  //   if extension is loading show skeleton
  if (extensionLoading || !extensionData)
    return (
      // skeleton for transcript
      <div>
        <div className="space-y-4 w-full">
          {Array.from({ length: 16 }).map((_, index) => (
            <div className="flex flex-col w-full justify-between items-center p-3 border-[0.5px] rounded-md border-zinc-200 space-y-4">
              <div className="w-full flex flex-row items-center justify-between">
                <Skeleton key={index} className="h-8 w-32" />
              </div>
              <Skeleton key={index} className="h-36 w-full" />
            </div>
          ))}
        </div>
      </div>
    )

  // show transcript list
  return (
    <div ref={ref}>
      <TranscriptList
        transcript={transcriptJSON}
        searchInput={transcriptSearch}
      />
    </div>
  )
})

const TranscriptList = memo(
  ({ transcript, searchInput }: TranscriptListProps) => {
    // filter transcript based on search input and show the result, if no search input then show full transcript
    const filteredTranscript = useMemo(() => {
      return searchInput
        ? transcript.filter((item) =>
            item.text.toLowerCase().includes(searchInput.toLowerCase())
          )
        : transcript
    }, [transcript, searchInput])

    // in case of no transcript, show no results found
    if (filteredTranscript.length <= 0) {
      return (
        <div>
          <p>No results found</p>
        </div>
      )
    }

    // show transcript per item
    return (
      <div className="space-y-4">
        {filteredTranscript.map((item) => (
          <TranscriptItem
            key={item.startTime}
            item={item}
            searchInput={searchInput}
          />
        ))}
      </div>
    )
  },
  (prevProps, nextPropr) =>
    prevProps.transcript === nextPropr.transcript &&
    prevProps.searchInput === nextPropr.searchInput
)

const TranscriptItem = ({ item, searchInput }: TranscriptItemProps) => {
  const player = document.querySelector("video") // getting the YT page video player (video element)
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })

  //   jump to current time in the video player
  const jumpToCurrentTime = () => {
    if (!player) return

    player.currentTime = item.startTime / 1000
  }

  //   copy the transcript section
  const copySection = () => {
    if (isCopied) return
    copyToClipboard(item.text)
  }

  //   if the search input matches the text, highlight that text part with yellow background
  const highlightText = (text: string, search: string) => {
    if (!search) return <>{text}</>
    const parts = text.split(new RegExp(`(${search})`, "gi"))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: "yellow" }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  const startTime = new Date(item.startTime).toISOString().substr(14, 5)
  const endTime = new Date(item.endTime).toISOString().substr(14, 5)

  return (
    <div
      data-start-time={item.startTime}
      data-end-time={item.endTime}
      className="flex flex-col w-full justify-between items-center p-3 border-[0.5px] rounded-md border-zinc-200 space-y-4 group">
      <div className="w-full flex flex-row items-center justify-between">
        <Button
          variant="outline"
          className="space-x-2 bg-transparent dark:bg-transparent border-[0.5px]"
          onClick={jumpToCurrentTime}>
          <ClockIcon className="h-4 w-4 opacity-60" />
          <span className="text-blue-500 text-[11px] hover:cursor-pointer hover:underline">
            {startTime}: {endTime}
          </span>
        </Button>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <TooltipWrapper text="Copy Section">
            <Button variant="outline" size="icon" onClick={copySection}>
              {isCopied ? (
                <CheckIcon className="h-4.5 w-4.5 opacity-60" />
              ) : (
                <ClipboardCopyIcon className="h-4.5 w-4.5 opacity-60" />
              )}
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      <p className="text-[10.5px] capitalize leading-7">
        {highlightText(item.text, searchInput)}
      </p>
    </div>
  )
}

export default TranscriptContent
