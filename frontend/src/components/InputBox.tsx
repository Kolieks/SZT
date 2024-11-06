import { useState } from "react";
import { InputHTMLAttributes } from "react";

interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mySize: string;
  equalize?: boolean;
  isEmail?: boolean;
  isPassword?: boolean;
  onEmailValidation?: (isValid: boolean) => void;
}

const InputBox = ({
  label,
  mySize,
  equalize = false,
  isEmail = false,
  isPassword = false,
  onEmailValidation,
  ...rest
}: InputBoxProps) => {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const validateEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEmail) {
      const isValid = validateEmail(e.target.value);
      setIsValidEmail(isValid);
      if (onEmailValidation) {
        onEmailValidation(isValid);
      }
    }

    if (isPassword) {
      const isValid = validatePassword(e.target.value);
      setIsValidPassword(isValid);
    }

    if (rest.onChange) {
      rest.onChange(e);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="items-center flex gap-1">
        <label className={`${equalize ? "w-[150px]" : ""}`}>{label}</label>
        <input
          {...rest}
          className={`border border-sky-500 rounded bg-slate-900 px-2 py-1 ${mySize} ${
            (isEmail && !isValidEmail) || (isPassword && !isValidPassword)
              ? "border-red-500"
              : ""
          }`}
          onChange={handleChange}
        />
      </div>
      {isEmail && !isValidEmail && (
        <p className="text-red-500 text-sm px-1">Niepoprawny email</p>
      )}
      {isPassword && !isValidPassword && (
        <p className="text-red-500 text-sm px-1">
          Hasło musi mieć co najmniej 6 znaków
        </p>
      )}
    </div>
  );
};

export default InputBox;
