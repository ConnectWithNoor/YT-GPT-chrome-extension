import { useExtension } from "@/hooks/use-context"
import React from "react"

import Chat from "./chat"
import Summary from "./summary"
import Transcript from "./transcript"

type Props = {}

function Panels({}: Props) {
  const { extensionPanel } = useExtension()

  return (
    <div>
      {extensionPanel === "Summary" && <Summary></Summary>}
      {extensionPanel === "Transcript" && <Transcript />}
      {extensionPanel === "Chat" && <Chat />}
    </div>
  )
}

export default Panels
