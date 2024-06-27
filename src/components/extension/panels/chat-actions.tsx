import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useChat, useExtension } from "@/hooks/use-context";
import { models } from "@/utils/constants";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";

import TooltipWrapper from "../tooltip-wrapper";

type Props = {
  className?: string;
};

function ChatActions({ className }: Props) {
  const {
    chatModel,
    chatIsGenerating,
    setChatMessages,
    setChatIsGenerating,
    setChatIsError,
    setChatModel,
    resetChat
  } = useChat();

  const { extensionLoading } = useExtension();

  return (
    <div
      className={`${className} flex flex-row w-full justify-between items-center sticky top-0 z-10 bg-white pt-3.5 pb-3 px-3 space-x-4 dark:bg-[#0f0f0f]`}>
      <select
        value={chatModel.value}
        className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-fit space-x-3"
        onChange={(e) =>
          setChatModel(models.find((model) => model.value === e.target.value))
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
        <TooltipWrapper text="New Chat">
          <Button
            className="flex flex-row space-x-2"
            variant="outline"
            onClick={resetChat}
            disabled={chatIsGenerating || extensionLoading}>
            <PlusIcon className="h-4 w-4 opacity-60" />
            <span>New Chat</span>
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
}

export default ChatActions;
