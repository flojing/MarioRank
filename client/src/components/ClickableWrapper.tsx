import type React from "react";

interface ClickableWrapperProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

const ClickableWrapper: React.FC<ClickableWrapperProps> = ({
  onClick,
  children,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div onClick={onClick} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default ClickableWrapper;
