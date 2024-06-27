import { ChatProvider } from "@/context/chat-context";
import { ExtensionProvider } from "@/context/extension-context";
import { SummaryProvider } from "@/context/summary-context";
import { TranscriptProvider } from "@/context/transcript-context";
import React from "react";

type Props = { children: React.ReactNode };

function Provider({ children }: Props) {
  return (
    <ExtensionProvider>
      <SummaryProvider>
        <TranscriptProvider>
          <ChatProvider>{children}</ChatProvider>
        </TranscriptProvider>
      </SummaryProvider>
    </ExtensionProvider>
  );
}

export default Provider;
