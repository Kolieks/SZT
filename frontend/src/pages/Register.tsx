import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputBox from "../components/InputBox";
import Button from "../components/Button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid && isPasswordValid && isNameValid) {
      await register(email, name, password);
      navigate("/");
    }
  };

  const handleEmailValidation = (isValid: boolean) => {
    setIsEmailValid(isValid);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setIsNameValid(value.length >= 1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(value.length >= 6);
  };

  return (
    <div className="flex w-full h-full px-10 py-5 justify-center">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-3 max-w-[610px]">
          <h1 className="text-3xl flex w-full justify-center">
            Join Our Community!
          </h1>
          <p className="">
            Create your account and unlock a world of exclusive features. Rate
            and review your favorite games, participate in discussions, and
            connect with fellow gamers. It only takes a few moments to get
            started! Already have an account? Log in and dive right back in.
          </p>
        </div>
        <div className="flex flex-col gap-2 border border-sky-500 px-10 py-5 rounded min-w-[305px] shadow-md shadow-black items-center">
          <div className="text-xl flex justify-center">Sign in</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <InputBox
              label=""
              mySize="w-[200px]"
              type="text"
              value={name}
              placeholder="Name"
              onChange={handleNameChange}
            />
            <InputBox
              label=""
              mySize="w-[200px]"
              isEmail={true}
              onEmailValidation={handleEmailValidation}
              type="text"
              value={email}
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              label=""
              mySize="w-[200px]"
              isPassword={true}
              type="password"
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              disabled={!isEmailValid || !isPasswordValid || !isNameValid}
            >
              Sign in
            </Button>
          </form>
          <div>
            <Link to="/login" className="hover:text-sky-500 duration-300">
              Already have an account? Log in!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
