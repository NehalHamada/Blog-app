import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import { motion as Motion } from "framer-motion";

// Validation Schema
const schema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters and spaces allowed"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  userpass: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{6,}$/,
      "Password must contain at least 1 uppercase, 1 number, and 1 special character"
    ),
  conuserpass: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("userpass")], "Passwords must match"),
});

export default function Regist({
  handleImageUpload,
  image,
  preview,
  fileInputRef,
  triggerFileInput,
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // 1) check if email already exists
      const checkRes = await fetch(
        `http://localhost:5001/users?email=${data.email}`
      );
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        toast.error("Email already registered!");
        return;
      }

      // 2) get all users to calculate new numeric id
      const allRes = await fetch("http://localhost:5001/users");
      const users = await allRes.json();

      const newId =
        users.length > 0 ? Math.max(...users.map((u) => Number(u.id))) + 1 : 1;

      // 3) prepare user object
      const newUser = {
        id: newId,
        name: data.username,
        email: data.email,
        password: data.userpass,
        image: image || "",
      };

      // 4) POST request to json-server
      const res = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        toast.error("Failed to register user");
        return;
      }

      toast.success("User registered successfully!");
      navigate("/");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Motion.div
      className="min-h-screen bg-base-200 flex items-center justify-center py-10 px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <Motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-8 rounded-2xl shadow-xl w-[500px] space-y-6 border border-base-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}>
        {/* Upload Image */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <Motion.div
            onClick={triggerFileInput}
            className="relative w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full hover:border-primary transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <Camera className="w-10 h-10 text-gray-400 hover:text-primary transition-colors" />
            )}
          </Motion.div>
          <p className="text-gray-500 text-sm mt-2">Upload Profile Photo</p>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your name"
            className="input input-bordered w-full"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-error text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="userpass" className="block mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            id="userpass"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            {...register("userpass")}
          />
          {errors.userpass && (
            <p className="text-error text-sm mt-1">{errors.userpass.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="conuserpass" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="conuserpass"
            placeholder="Confirm your password"
            className="input input-bordered w-full"
            {...register("conuserpass")}
          />
          {errors.conuserpass && (
            <p className="text-error text-sm mt-1">
              {errors.conuserpass.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <button type="submit" className="btn regist-btn w-full mt-4">
            Register
          </button>
          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </Motion.div>
      </Motion.form>
    </Motion.div>
  );
}
