import MarkdownToHTML from "@/components/global/markdown-to-html"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSummary } from "@/hooks/use-summary"
import React from "react"

type Props = {}

function SummaryContent({}: Props) {
  const { summaryContent, summaryIsGenerating, generateSummary } = useSummary()

  if (!summaryContent && summaryIsGenerating) {
    // summary skeleton
    return (
      <div className="flex justify-center items-center w-full p-3 bg-white dark:bg-[#0f0f0f]">
        <div className="h-[600px] w-full px-3">
          <div className="w-full rounded-md space-y-4">
            <div className="flex flex-col space-y-5">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!summaryContent && !summaryIsGenerating) {
    return (
      <div className="flex justify-center items-center w-full p-3 bg-white dark:bg-[#0f0f0f]">
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={generateSummary}>
          <span className="text-sm">Generate Summary</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center w-full p-3 bg-white dark:bg-[#0f0f0f]">
      <div className="h-[600px] w-full px-3 opacity-80">
        <MarkdownToHTML markdown={summaryContent} className="pb-6" />
      </div>
    </div>
  )
}

export default SummaryContent
