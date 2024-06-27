import { ChatContext } from "@/context/chat-context";
import { ExtensionContext } from "@/context/extension-context";
import { SummaryContext } from "@/context/summary-context";
import { TranscriptContext } from "@/context/transcript-context";
import { useContext } from "react";

export function useExtension() {
  const context = useContext(ExtensionContext);

  if (!context) {
    throw new Error("useExtension must be used within an ExtensionProvider");
  }

  return context;
}

export function useSummary() {
  const context = useContext(SummaryContext);

  if (!context) {
    throw new Error("useSummary must be used within an SummaryProvider");
  }

  return context;
}

export function useTranscript() {
  const context = useContext(TranscriptContext);

  if (!context) {
    throw new Error("useTranscript must be used within an TranscriptProvider");
  }

  return context;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within an TranscriptProvider");
  }

  return context;
}
