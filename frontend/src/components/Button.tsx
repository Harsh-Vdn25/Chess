import type { ReactNode } from "react";

export const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md cursor-pointer shadow-md shadow-black"
    >
      {children}
    </button>
  );
};
