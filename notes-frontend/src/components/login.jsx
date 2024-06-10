/* eslint-disable react/prop-types */
"use client";
import { Label } from "./label";
import { cn } from "../utils/cn";
import { Input } from "./input";
import { BackgroundGradientAnimation } from "./backgrad";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import toast from "react-hot-toast";

export function LoginFormDemo() {  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(()=>{
  if(token) navigate("/");
  },[])
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {
      setloading(true);
      if(!email && !password) {toast.error("All fields are required");return}
      const res = await fetch("http://localhost:5000/login",{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
      });
      const data = await res.json();
      if(res.ok)
      {
        toast.success("Login Successfully");
        localStorage.setItem("token",data.token);
        localStorage.setItem("name",data.name);
        navigate("/");
      }
      else{
        toast.error(data.message);
      }
    }
    catch(err){console.log(err)}
    finally{setloading(false)}
  };
  return (
    <BackgroundGradientAnimation className="w-full h-screen flex justify-center items-center p-4 md:p-8">
    <div className="w-full relative z-10 mx-auto rounded-lg py-6 md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-[#ffffff34]">
      <h2 className="font-bold text-base sm:text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Animated Notes Keeper
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mb-4 dark:text-neutral-300">
        Login to Continue
      </p>

      <form className="" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={email} onChange={(e)=>setemail(e.target.value)} placeholder="xyz@abc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" value={password} onChange={(e)=>setpassword(e.target.value)} placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br disabled:bg-gray-400 mt-4 relative group/btn hover:-translate-y-1 transition-all  dark:bg-[#ffffff5e] w-full text-black rounded-md h-10 font-medium dark:shadow-[1px_1px_1px_1px_var(--zinc-900)_inset,-1px_-1px_-1px_-1px_var(--zinc-900)_inset]"
          type="submit"
          disabled={loading}
          >
          Login &rarr;
          <BottomGradient />
        </button>
        <p className="text-sm text-white text-center mt-4">Not Registered? <Link to={"/signup"} className="font-bold hover:underline">Signup</Link></p>
      </form>
    </div>
</BackgroundGradientAnimation>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-[2px] w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-[3px] w-1/2 mx-auto -bottom-px inset-x-16 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
