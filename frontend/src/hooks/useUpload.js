import { useCallback, useRef } from "react";

export default function useUpload({ accept, multiple = false } = {}) {
  const inputRef = useRef(null);

  const trigger = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const getInputProps = useCallback(
    (onChange) => ({
      ref: inputRef,
      type: "file",
      accept,
      multiple,
      onChange,
      className: "hidden",
    }),
    [accept, multiple]
  );

  return {
    inputRef,
    trigger,
    reset,
    getInputProps,
  };
}

