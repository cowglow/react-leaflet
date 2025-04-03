import { CircularProgress } from "@mui/material";

type LoaderProps = { open?: boolean };

export default function Loader({ open }: LoaderProps) {
  if (!open) return null;

  return <CircularProgress sx={{ position: "absolute", zIndex: 9999 }} />;
}
