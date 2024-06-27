import React from "react";

import ChatActions from "./chat-actions";
import ChatList from "./chat-list";
import ChatPromptForm from "./chat-prompt-form";

type Props = {};

function Chat({}: Props) {
  return (
    <div className="w-full h-[498px] relative bg-white">
      <ChatActions />
      <ChatList />
      <ChatPromptForm />
    </div>
  );
}

export default Chat;
