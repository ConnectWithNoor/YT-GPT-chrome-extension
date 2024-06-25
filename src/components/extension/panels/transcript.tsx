import React, { useRef } from "react"

import TranscriptAction from "./transcript-action"
import TranscriptContent from "./transcript.content"

type Props = {}

function Transcript({}: Props) {
  const player = document.querySelector("video")
  const transcriptListRef = useRef(null)

  const jumpToCurrentTime = () => {
    if (!player || !transcriptListRef.current) return

    const time = Math.round(player.currentTime * 1000)

    const itemContainer = transcriptListRef.current
      .firstElementChild as HTMLElement

    if (itemContainer) {
      const targetEle = Array.from(itemContainer.children).find((child) => {
        const startTime = parseInt(child.getAttribute("data-start-time") || "0")
        const endTime = parseInt(child.getAttribute("data-end-time") || "0")

        return startTime <= time && endTime >= time
      })

      if (targetEle) {
        targetEle.scrollIntoView({ behavior: "smooth", block: "center" })

        setTimeout(() => {
          targetEle.classList.add("bg-zinc-100")
          targetEle.classList.add("dark:bg-[#141414]")
          targetEle.classList.add("transition-all")
        }, 3000)
      }
    }
  }

  return (
    <>
      <TranscriptAction jumpToCurrentTime={jumpToCurrentTime} />
      <TranscriptContent ref={transcriptListRef} />
    </>
  )
}

export default Transcript
