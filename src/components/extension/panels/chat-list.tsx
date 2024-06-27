import MarkdownToHTML from "@/components/global/markdown-to-html";
import { spinner } from "@/components/global/spinner";
import { useChat } from "@/hooks/use-context";
import { cn } from "@/lib/utils";
import { DoubleArrowRightIcon, ModulzLogoIcon } from "@radix-ui/react-icons";
import React, { useEffect, useRef } from "react";

type ChatListProps = {
  className?: string;
};

type ChatITemProps = {
  message: Message;
};

function ChatList({ className }: ChatListProps) {
  const { chatMessages } = useChat();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className={cn("pt-16", className)} ref={scrollContainerRef}>
      {!chatMessages || chatMessages.length <= 0 ? (
        <div className="flex justify-center items-center mx-14 font-semibold text-[16px] my-5">
          Hi. I'm your GPT powered chat assistant. Ask me anything related to
          this video and I'll try to help you out.
        </div>
      ) : (
        <div className="h-[375px] overflow-y-scroll no-scrollbar">
          {chatMessages.map((message, index) => (
            <ChatItem key={index} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChatItem({ message }: ChatITemProps) {
  return (
    <div className="group relative flex items-start px-8 py-5">
      <div
        className="
      flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-md border border-zinc-200  -mt-1">
        {message.role === "user" ? (
          <DoubleArrowRightIcon className="w-4 h-4" />
        ) : (
          <ModulzLogoIcon className="w-4 h-4" />
        )}
      </div>

      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {message.role === "assistant" && !message.content ? (
          <span>{spinner}</span>
        ) : (
          <MarkdownToHTML markdown={message.content} />
        )}
      </div>
    </div>
  );
}

export default ChatList;
