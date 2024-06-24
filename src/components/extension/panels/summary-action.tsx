import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useSummary } from "@/hooks/use-summary"
import { models, prompts } from "@/utils/constants"
import { CheckIcon, ClipboardCopyIcon, ReloadIcon } from "@radix-ui/react-icons"
import React from "react"

import TooltipWrapper from "../tooltip-wrapper"

type Props = {}

function SummaryActions({}: Props) {
  const {
    summaryPrompt,
    summaryIsGenerating,
    summaryModel,
    summaryContent,
    setSummaryPrompt,
    setSummaryModel,
    generateSummary
  } = useSummary()

  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })

  const copySummary = () => {
    if (isCopied || !summaryContent || !summaryIsGenerating) return

    copyToClipboard(summaryContent)
  }

  return (
    <div className="flex flex-row w-full justify-between items-center sticky top-0 z-20 bg-white pt-3.5 pb-2 px-3">
      <Select
        value={summaryModel.value}
        onValueChange={(value) =>
          setSummaryModel(models.find((model) => model.value === value))
        }>
        <SelectTrigger className="w-fit space-x-3">
          <SelectValue placeholder="Model" />
        </SelectTrigger>

        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex flex-row items-center">
                <div className="mr-2"> {model.icon}</div>
                <p>{model.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-row space-x-2">
        <TooltipWrapper text="Regenerate Summary">
          <Button
            variant="outline"
            size="icon"
            onClick={generateSummary}
            disabled={summaryIsGenerating}>
            <ReloadIcon className="h-4 w-4 opacity-60" />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper text="Copy Summary">
          <Button
            variant="outline"
            size="icon"
            onClick={copySummary}
            disabled={summaryIsGenerating}>
            {isCopied ? (
              <CheckIcon className="h-4.5 w-4.5 opacity-60" />
            ) : (
              <ClipboardCopyIcon className="h-4.5 w-4.5 opacity-60" />
            )}
          </Button>
        </TooltipWrapper>

        <Select
          value={summaryPrompt.value}
          onValueChange={(value) =>
            setSummaryPrompt(prompts.find((prompt) => prompt.value === value))
          }>
          <SelectTrigger className="w-fit space-x-3">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {prompts.map((prompt) => (
              <SelectItem key={prompt.value} value={prompt.value}>
                <div className="flex flex-row items-center">{prompt.label}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SummaryActions
