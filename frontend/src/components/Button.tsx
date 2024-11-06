import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, disabled = false, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`bg-slate-900 border border-sky-500 px-4 py-2 rounded shadow-sm shadow-black h-[40px] duration-300 ${
        !disabled
          ? "hover:bg-sky-500 hover:text-black hover:font-bold"
          : "cursor-not-allowed opacity-50"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
