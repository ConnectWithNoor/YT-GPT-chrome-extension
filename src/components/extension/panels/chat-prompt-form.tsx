import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-context";
import { useEnterSubmit } from "@/hooks/use-key-press";
import { cn } from "@/lib/utils";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import React, { useEffect, useRef } from "react";
import TextArea from "react-textarea-autosize";

import TooltipWrapper from "../tooltip-wrapper";

type Props = {
  className?: string;
};

function ChatPromptForm({ className }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    chatModel,
    chatMessages,
    chatPrompt,
    setChatPrompt,
    setChatMessages,
    generateChat
  } = useChat();

  const { formRef, onKeyDown, onKeyUp } = useEnterSubmit();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const value = chatPrompt.trim();
    setChatPrompt("");
    if (!value) return;

    const initialMessages = [...chatMessages];

    setChatMessages([...initialMessages, { content: value, role: "user" }]);

    // send the messages to the chat port
    await generateChat(chatModel.content, [
      ...initialMessages,
      { content: value, role: "user" }
    ]);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn("absolute bottom-0 z-10 p-4 w-full bg-white", className)}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-md  border border-zinc-200">
        <TextArea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder="Send a message..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          rows={1}
          className="min-h-[50px] w-full resize-none bg-transparent px-6 py-6 focus-within:outline-none text-[12px]"
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
        />
        <div className="absolute right-0 top-[10px] pr-3">
          <TooltipWrapper text="Send Message">
            <Button
              type="submit"
              size="icon"
              variant="outline"
              disabled={!chatPrompt || chatPrompt.trim() === ""}
              className="size-[32px]">
              <PaperPlaneIcon className="w-5 h-5" />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
    </form>
  );
}

export default ChatPromptForm;
