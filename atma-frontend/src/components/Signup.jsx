/* eslint-disable react/prop-types */
"use client";
import { Label } from "./Label";
import { cn } from "../utils/cn";
import { Input } from "./Input";
import { BackgroundGradientAnimation } from "./backgrad";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import toast from "react-hot-toast";

export function SignupFormDemo() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {
      setloading(true);
      if(!name && !email && !password) {toast.error("All fields are required");return}
      if(password.length<6){toast.error("Password should be minimum 6 characters long");return}
      const res = await fetch("http://192.168.1.5:5000/register",{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name,email,password})
      });
      const data = await res.json();
      if(res.ok)
      {
        toast.success("User Registered Successfully");
        navigate("/login");
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
    <div className="w-full lg:w-[60%] relative z-10 mx-auto rounded-lg py-6 md:rounded-2xl p-4 md:p-8 shadow-input bg-[#ffffff34]">
    <img src="logo.png" alt="Logo" width={100} height={100}  className="mb-4 invert"/>
      <h2 className="font-bold text-base sm:text-xl text-neutral-200">
        Welcome to Animated Task Manager
      </h2>
      <p className="text-sm max-w-sm mb-4 text-neutral-300">
        Signup to Continue
      </p>

      <form className="" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e)=>setname(e.target.value)} placeholder="XYZ" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={email} onChange={(e)=>setemail(e.target.value)} placeholder="xyz@abc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" value={password} onChange={(e)=>setpassword(e.target.value)} placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br disabled:bg-gray-400 mt-2 relative group/btn hover:-translate-y-1 transition-all bg-[#ffffff5e] w-full text-black rounded-md h-10 font-medium shadow-[1px_1px_1px_1px_var(--zinc-900)_inset,-1px_-1px_-1px_-1px_var(--zinc-900)_inset]"
          type="submit"
          disabled={loading}
          >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <p className="text-sm text-white text-center mt-8">Already Registered? <Link to={"/login"} className="font-bold hover:underline">Login</Link></p>
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
