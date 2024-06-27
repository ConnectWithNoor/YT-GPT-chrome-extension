import { useExtension } from "@/hooks/use-context";
import { models } from "@/utils/constants";
import { createContext, useEffect, useState } from "react";

import { usePort } from "@plasmohq/messaging/hook";

type ChatContextProps = {
  chatModel: Model;
  chatIsGenerating: boolean;
  chatIsError: boolean;
  chatMessages: Message[] | undefined;
  chatPrompt: string;
  chatSuggestions: string[];
  chatIsGenetatingSuggestions: boolean;
  chatIsErrorSuggestions: boolean;
};

type ChatContextValueTypes = {
  setChatModel: (model: Model) => void;
  setChatIsGenerating: (isGenerating: boolean) => void;
  setChatIsError: (isError: boolean) => void;
  setChatMessages: (messages: Message[]) => void;
  setChatPrompt: (prompt: string) => void;
  setChatSuggestions: (suggestions: string[]) => void;
  setChatIsGenetatingSuggestions: (isGenerating: boolean) => void;
  setChatIsErrorSuggestions: (isError: boolean) => void;

  resetChat: () => void;
  generateChat: (model: string, messages: Message[]) => Promise<void>;
};

const initialState: ChatContextProps = {
  chatModel: models[0],
  chatIsGenerating: false,
  chatIsError: false,
  chatMessages: [],
  chatPrompt: "",
  chatSuggestions: [],
  chatIsGenetatingSuggestions: false,
  chatIsErrorSuggestions: false
};

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatContext = createContext<
  (ChatContextProps & ChatContextValueTypes) | null
>(null);

export function ChatProvider({ children }: ChatProviderProps) {
  const [chatModel, setChatModel] = useState<Model>(initialState.chatModel);
  const [chatIsGenerating, setChatIsGenerating] = useState<boolean>(
    initialState.chatIsGenerating
  );
  const [chatIsError, setChatIsError] = useState<boolean>(
    initialState.chatIsError
  );
  const [chatMessages, setChatMessages] = useState<Message[] | undefined>(
    initialState.chatMessages
  );
  const [chatPrompt, setChatPrompt] = useState<string>(initialState.chatPrompt);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>(
    initialState.chatSuggestions
  );
  const [chatIsGenetatingSuggestions, setChatIsGenetatingSuggestions] =
    useState<boolean>(initialState.chatIsGenetatingSuggestions);
  const [chatIsErrorSuggestions, setChatIsErrorSuggestions] = useState<boolean>(
    initialState.chatIsErrorSuggestions
  );

  const chatPort = usePort("chat");
  const { extensionData } = useExtension();

  const resetChat = () => {
    setChatMessages([]);
    setChatIsGenerating(false);
    setChatIsError(false);
  };

  const generateChat = async (model: string, messages: Message[]) => {
    setChatIsGenerating(true);
    setChatIsError(false);

    try {
      chatPort.send({
        messages,
        model,
        context: extensionData
      });
    } catch (error) {}
  };

  // to get the summary message (content) from the port
  useEffect(() => {
    if (chatPort.data?.message !== undefined && !chatPort.data?.isEnd) {
      if (chatMessages[chatMessages.length - 1].role === "user") {
        setChatMessages([...chatMessages, { role: "assistant", content: "" }]);
      } else {
        const newMessages = [...chatMessages];
        newMessages[newMessages.length - 1].content = chatPort.data.message;

        setChatMessages([...newMessages]);
      }
    } else {
      setChatIsGenerating(false);
    }

    setChatIsError(false);
  }, [chatPort.data?.message]);

  return (
    <ChatContext.Provider
      value={{
        chatIsError,
        chatIsErrorSuggestions,
        chatIsGenerating,
        chatIsGenetatingSuggestions,
        chatMessages,
        chatModel,
        chatPrompt,
        chatSuggestions,
        setChatIsError,
        setChatIsErrorSuggestions,
        setChatIsGenerating,
        setChatIsGenetatingSuggestions,
        setChatMessages,
        setChatModel,
        setChatPrompt,
        setChatSuggestions,
        resetChat,
        generateChat
      }}>
      {children}
    </ChatContext.Provider>
  );
}
