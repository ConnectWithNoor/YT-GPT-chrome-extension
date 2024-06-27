import { useRef, type RefObject } from "react";

type UseKeyPressProps = {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const useEnterSubmit = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
  };

  return {
    formRef,
    onKeyDown,
    onKeyUp
  };
};
