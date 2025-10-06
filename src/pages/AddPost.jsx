import { Camera } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function AddPost({
  user,
  setUser,
  title,
  setTitle,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  posts,
  setPosts,
  fileInputRef,
  handleImageUpload,
  triggerFileInput,
  preview,
}) {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }

    if (!user) {
      toast.error("Please login");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    // auto id
    const newPost = {
      id: posts.length ? posts[posts.length - 1].id + 1 : 1,
      title,
      body: description,
      image: imageUrl, // ✅ now base64 image from upload
      author: user.name,
    };

    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setPosts([...posts, newPost]);
        setTitle("");
        setDescription("");
        setImageUrl("");
        toast.success("Post added successfully");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/home");
      }
    } catch {
      toast.error("Failed to add post");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-10 px-5">
      <Motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-base-100 p-8 rounded-2xl shadow-xl w-[500px] space-y-6 border border-base-300">
        <h3 className="addpost-head text-center text-3xl font-bold text-primary">
          New Post
        </h3>

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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full hover:border-primary transition-all">
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
          <p className="text-gray-500 text-sm mt-2">Upload Post Image</p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter post description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full resize-none"
            rows="3"
            required></textarea>
        </div>

        {/* Submit */}
        <Motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <button type="submit" className="btn add-post w-full mt-4">
            Add Post
          </button>
        </Motion.div>
      </Motion.form>
    </div>
  );
}
