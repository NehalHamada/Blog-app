import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";

// validation schema
const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  userpass: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function Login({ rememberMe, setRememberMe }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // login handler
  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `https://abc123.ngrok.io/users?email=${data.email}`
      );
      const users = await res.json();

      if (users.length === 0) {
        toast.error("Email not found");
        return;
      }

      const user = users[0];

      if (user.password !== data.userpass) {
        toast.error("Invalid password");
        return;
      }
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");


      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <Motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-base-100 p-8 rounded-2xl shadow-lg w-[500px] space-y-5 border border-base-300">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Password */}
        <div>
          <label htmlFor="userpass" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="userpass"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            {...register("userpass", { required: "Password is required" })}
          />
          {errors.userpass && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userpass.message}
            </p>
          )}
        </div>
        {/* Remember Me + Register */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="checkbox checkbox-sm"
            />
            Remember Me
          </label>
          <Link to="/login/regist" className="btn regist-btn">
            Register Now
          </Link>
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn login-btn w-full mt-3">
          Login
        </button>
      </Motion.form>
    </div>
  );
}
