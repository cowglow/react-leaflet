import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { parseCSVString } from "utils/helper.ts";

interface ImportControllerProps {
  label: string;
  onLoad: (value: string[][]) => void;
}

export default function ImportController({
  label,
  onLoad,
}: ImportControllerProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = target.files && target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const readerResult = target.result;
      const parsedCSV = parseCSVString(readerResult as string);
      onLoad(parsedCSV);
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <label>
      {label}
      <input onInput={inputHandler} type="file" />
    </label>
  );
}
