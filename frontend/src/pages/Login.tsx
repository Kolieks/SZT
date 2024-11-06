import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import InputBox from "../components/InputBox";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <div className="flex w-full h-full px-10 py-5 justify-center">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-3 max-w-[610px]">
          <h1 className="text-3xl flex w-full justify-center">Welcome Back!</h1>
          <p className="">
            Log in to access your personalized dashboard, join the community
            discussions, rate your favorite games, and stay updated with the
            latest content. Not a member yet? Sign up to join our growing
            community of gamers and enjoy exclusive features.
          </p>
        </div>
        <div className="flex flex-col gap-2 border border-sky-500 px-10 py-5 rounded min-w-[305px] shadow-lg shadow-black items-center">
          <div className="text-xl flex justify-center">Log in</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <InputBox
              label=""
              mySize="w-[200px]"
              isEmail={true}
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              label=""
              mySize="w-[200px]"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Log in</Button>
          </form>
          <div>
            <Link to="/register" className="hover:text-sky-500 duration-300">
              Don't have account? Sign in!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
