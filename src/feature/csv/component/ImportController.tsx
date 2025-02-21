import type { ChangeEvent } from "react";
import { useEffect } from "react";
import useCsvData from "../hook/use-csv-data";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Tooltip } from "@mui/material";
import {
  StyledFileInput,
  StyledFileInputLabel,
} from "feature/csv/component/ExportButton.Styled.ts";

interface ImportControllerProps {
  label: string;
  onLoad?: (value: string[][]) => void;
}

export default function ImportController({
  label,
  onLoad,
}: ImportControllerProps) {
  const { data, importCSVFile } = useCsvData();

  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = target.files && target.files[0];
    if (!selectedFile) return;
    importCSVFile(selectedFile);
  };

  useEffect(() => {
    if (!data) return;
    if (onLoad) {
      onLoad(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Tooltip title={label} placement="right">
      <StyledFileInputLabel htmlFor="input-file-button">
        <StyledFileInput
          id="input-file-button"
          className="btn"
          onInput={inputHandler}
          type="file"
        />
        <div>
          <FileUploadIcon />
        </div>
      </StyledFileInputLabel>
    </Tooltip>
  );
}
