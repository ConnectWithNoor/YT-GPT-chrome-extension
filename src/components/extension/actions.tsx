import { useExtension } from "@/hooks/use-context"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CopyVideoURL } from "@/utils/helpers"
import {
  ActivityLogIcon,
  CardStackPlusIcon,
  CaretSortIcon,
  ChatBubbleIcon,
  CheckIcon,
  Link2Icon,
  Pencil2Icon
} from "@radix-ui/react-icons"
import React from "react"

import { Button } from "../ui/button"
import { CollapsibleTrigger } from "../ui/collapsible"
import TooltipWrapper from "./tooltip-wrapper"

type Props = {}

function Actions({}: Props) {
  const {
    setExtensionPanel,
    extensionPanel,
    setExtensionIsOpen,
    extensionIsOpen
  } = useExtension()

  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })

  return (
    <div className="border border-zinc-200 rounded-md flex items-center justify-between p-2.5 px-3 dark:bg-[#0f0f0f] dark:text-white dark:border-zinc-800">
      <CardStackPlusIcon className="h-6 w-6 opacity-50 ml-2" />
      <div className="flex justify-center items-center space-x-2">
        <div className="flex -space-x-px">
          <Button
            variant="outline"
            onClick={() => {
              setExtensionPanel("Summary")
              if (!extensionIsOpen) {
                setExtensionIsOpen(true)
              }
            }}
            className="rounded-r-none focus:z-10 bg-transparent space-x-2 items-center">
            <Pencil2Icon className="h-4 w-4 opacity-60" />
            <span className="opacity-90">Summary</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setExtensionPanel("Transcript")
              if (!extensionIsOpen) {
                setExtensionIsOpen(true)
              }
            }}
            className="
          rounded-r-none focus:z-10 bg-transparent space-x-2 items-center">
            <ActivityLogIcon className="h-4 w-4 opacity-60" />
            <span className="opacity-90">Transcript</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setExtensionPanel("Chat")
              if (!extensionIsOpen) {
                setExtensionIsOpen(true)
              }
            }}
            className="
          rounded-r-none focus:z-10 bg-transparent space-x-2 items-center">
            <ChatBubbleIcon className="h-4 w-4 opacity-60" />

            <span className="opacity-90">Chat</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipWrapper text="Copy Video URL">
          <Button
            variant="outline"
            size="icon"
            onClick={() => CopyVideoURL(isCopied, copyToClipboard)}>
            {isCopied ? (
              <CheckIcon className="h-4.5 w-4.5 opacity-60" />
            ) : (
              <Link2Icon className="h-4.5 w-4.5 opacity-60" />
            )}
          </Button>
        </TooltipWrapper>

        <CollapsibleTrigger>
          <Button variant="outline" size="icon">
            <CaretSortIcon className="h-4.5 w-4.5 opacity-60" />
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  )
}

export default Actions
