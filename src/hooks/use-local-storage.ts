import { useState } from "react";

interface LocalStorageHookProps<T> {
  key: string;
  defaultValue: T;
}

export const useLocalStorage = <T>({
  key,
  defaultValue,
}: LocalStorageHookProps<T>) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  window.localStorage.setItem(key, JSON.stringify(value));

  return [value, setValue];
};
