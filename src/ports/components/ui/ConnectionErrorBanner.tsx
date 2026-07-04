interface ConnectionErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ConnectionErrorBanner({ message, onRetry }: ConnectionErrorBannerProps) {
  return (
    <div
      className="standard-dialog"
      style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 1rem" }}
    >
      <span>{message}</span>
      <button type="button" className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
