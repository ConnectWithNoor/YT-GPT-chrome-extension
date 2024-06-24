import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { useExtension } from "@/hooks/use-context"
import { getCSSVariable, getVideoData, getVideoId } from "@/utils/helpers"
import React, { useEffect } from "react"

import Actions from "./actions"
import Panels from "./panels"

type Props = {}

function Extension({}: Props) {
  const {
    setExtensionContainer,
    setExtensionData,
    setExtensionIsOpen,
    setExtensionLoading,
    setExtensionTheme,
    setExtensionVideoId,

    extensionTheme,
    extensionIsOpen,
    extensionVideoId
  } = useExtension()

  useEffect(() => {
    const fetchVideoData = async () => {
      const id = getVideoId()

      if (id && id !== extensionVideoId) {
        setExtensionVideoId(id)
        setExtensionLoading(true)

        const data = await getVideoData(id)
        setExtensionData(data)
        setExtensionLoading(false)
      }
    }

    fetchVideoData() // to fetch for the first time.
    // this will fetch the video data every 2 seconds, so that if user changes the video, new data can be fetched
    const internvalId = setInterval(fetchVideoData, 2000)
    return () => clearInterval(internvalId)
  }, [extensionVideoId])

  // get the extension theme
  useEffect(() => {
    const backgroundColor = getCSSVariable("--yt-spec-base-background") // YT has this variable for their background color for extension theme

    if (backgroundColor.includes("fff")) {
      setExtensionTheme("light")
    } else {
      setExtensionTheme("dark")
    }
  }, [])

  if (!extensionTheme) return null

  return (
    <main
      ref={setExtensionContainer}
      className={`antialiased w-full mb-3 z-10 ${extensionTheme}`}>
      <div className="w-full">
        <Collapsible
          className="space-y-3"
          open={extensionIsOpen}
          onOpenChange={setExtensionIsOpen}>
          <Actions />
          <CollapsibleContent className="w-full h-fil max-h-[500px] border-zinc-200 rounded-md overflow-auto">
            <Panels />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  )
}

export default Extension
