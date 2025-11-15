"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick:()=>void;
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
      <button
        className={`bg-green-500 p-2 text-white shadow-black hover:bg-green-700 rounded-lg cursor-pointer ${className}`}
        onClick={onClick}>
        {children}
      </button>
  );
};
