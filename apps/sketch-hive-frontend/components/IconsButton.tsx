import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  title,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={activated}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        background: activated ? "#4f8cff" : "transparent",
        color: activated ? "#ffffff" : "#c9c9d4",
        transition: "background 120ms ease",
      }}
    >
      {icon}
    </button>
  );
}
