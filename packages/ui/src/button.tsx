"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick:()=>void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
      <button
        className="p-2 bg-green-500 text-white shadow-black hover:bg-green-700 cursor-pointer rounded-md "
        onClick={onClick}>
        {children}
      </button>
  );
};