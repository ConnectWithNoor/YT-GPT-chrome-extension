import { Button } from "@/components/ui/button";
import { useSummary } from "@/hooks/use-context";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { models, prompts } from "@/utils/constants";
import {
  CheckIcon,
  ClipboardCopyIcon,
  ReloadIcon
} from "@radix-ui/react-icons";
import React from "react";

import TooltipWrapper from "../tooltip-wrapper";

type Props = {};

function SummaryActions({}: Props) {
  const {
    summaryPrompt,
    summaryIsGenerating,
    summaryModel,
    summaryContent,
    setSummaryPrompt,
    setSummaryModel,
    generateSummary
  } = useSummary();

  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  const copySummary = () => {
    if (isCopied || !summaryContent || summaryIsGenerating) return;

    copyToClipboard(summaryContent);
  };

  return (
    <div className="flex flex-row w-full justify-between items-center sticky top-0 z-[100] bg-white pt-3.5 pb-2 px-3">
      <select
        value={summaryModel.value}
        className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-fit space-x-3"
        onChange={(e) =>
          setSummaryModel(
            models.find((model) => model.value === e.target.value)
          )
        }>
        {models.map((model) => (
          <option key={model.value} value={model.value.toString()}>
            <div className="flex flex-row items-center">
              <div className="mr-2"> {model.icon}</div>
              <p>{model.label}</p>
            </div>
          </option>
        ))}
      </select>

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

        <select
          value={summaryPrompt.value}
          className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-fit space-x-3"
          onChange={(e) =>
            setSummaryPrompt(
              prompts.find((prompt) => prompt.value === e.target.value)
            )
          }>
          {prompts.map((prompt) => (
            <option key={prompt.value} value={prompt.value.toString()}>
              <div className="flex flex-row items-center">{prompt.label}</div>
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SummaryActions;
