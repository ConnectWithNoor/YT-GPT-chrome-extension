type Model = {
  value: string;
  label: string;
  content?: string; // openAI model
  icon?: any;
};

type Prompt = {
  value: string;
  label: string;
  content: string;
};

type Transcript = {
  text: string;
  startTime: number;
  endTime: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};
