import { useExtension } from "@/hooks/use-context"
import { getCSSVariable, getVideoData, getVideoId } from "@/utils/helpers"
import React, { useEffect } from "react"

import { Collapsible } from "./ui/collapsible"

type Props = {}

function Extension({}: Props) {
  const {
    setExtensionContainer,
    setExtensionData,
    setExtensionIsOpen,
    setExtensionLoading,
    setExtensionPanel,
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

  return (
    <main
      ref={setExtensionContainer}
      className={`antialiased w-full mb-3 z-10 ${extensionTheme}`}>
      <div className="w-full">
        <Collapsible
          className="space-y-3"
          open={extensionIsOpen}
          onOpenChange={setExtensionIsOpen}>
          <h1>Extension Actions</h1>
        </Collapsible>
      </div>
    </main>
  )
}

export default Extension
