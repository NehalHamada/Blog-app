import React, { useRef } from "react";
import {
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Navigationbar from "./components/Navigationbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Regist from "./pages/Regist";
import AddPost from "./pages/AddPost";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  // states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // users
    const fetchedUsers = async () => {
      try {
        const response = await fetch("https://ab12cd34.ngrok.io/users");
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        toast.error("Error fetching posts:", error);
      }
    };

    // posts
    const fetchedPosts = async () => {
      try {
        const response = await fetch("https://ab12cd34.ngrok.io/posts");
        const result = await response.json();
        setPosts(result);
      } catch (error) {
        toast.error("Error fetching posts:", error);
      }
    };
    // reload user
    const storeUser = localStorage.getItem("user");
    if (storeUser) {
      setUser(JSON.parse(storeUser));
    }
    fetchedUsers();
    fetchedPosts();
  }, []);

  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    if (storeUser) {
      setUser(JSON.parse(storeUser));
    }
    const handleStorage = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // delete posts
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;
    try {
      const postToDelete = posts.find((post) => post.id === id);
      if (!postToDelete) {
        toast.error("Post not found");
        return;
      }
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      const response = await fetch(`https://ab12cd34.ngrok.io/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setPosts(posts);
        throw new Error(`Failed to delete post: ${response.status}`);
      }

      toast.success("Post deleted successfully");
    } catch (error) {
      setPosts(posts);
      toast.error(`Error deleting post: ${error.message}`);
    }
  };

  // edit post
  const handleUpdate = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditDescription(post.body); // ✅ use body because Home.jsx uses post.body
    setEditImageUrl(post.image);
  };

  const handleSaveUpdate = async () => {
    if (!editTitle || !editDescription || !editImageUrl) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const updatePost = {
        ...editingPost,
        title: editTitle,
        body: editDescription, 
        image: editImageUrl,
      };

      console.log("Updating Post:", updatePost);

      const response = await fetch(
        `https://ab12cd34.ngrok.io/posts/${editingPost.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePost),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === editingPost.id ? updatePost : p))
      );

      setEditingPost(null);
      toast.success("Post updated successfully");
      navigate("/home");
    } catch {
      toast.error("Error updating post");
    }
  };

  const handleCancelEdit = () => {
    const confirmed = confirm("Are you sure you want to cancel editing?");
    if (confirmed) {
      setEditingPost(null);
    }
  };

  // image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImage(base64);
      setPreview(base64);
      setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // image circle
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Navigationbar
        user={user}
        setUser={setUser}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <div>
        <Routes>
          <Route
            path="/home"
            element={
              <Home
                posts={posts}
                users={users}
                user={user}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            }
          />
          <Route
            path="/"
            element={
              <Login
                user={user}
                setUser={setUser}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                triggerFileInput={triggerFileInput}
                preview={preview}
              />
            }
          />
          <Route
            path="/login/regist"
            element={
              <Regist
                handleImageUpload={handleImageUpload}
                image={image}
                preview={preview}
                fileInputRef={fileInputRef}
                triggerFileInput={triggerFileInput}
              />
            }
          />
          <Route
            path="/addposts"
            element={
              <AddPost
                user={user}
                setUser={setUser}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                posts={posts}
                setPosts={setPosts}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                triggerFileInput={triggerFileInput}
                preview={preview}
              />
            }
          />
        </Routes>
      </div>

      {user && location.pathname === "/home" && (
        <Link
          to="/addposts"
          className="addbut fixed bottom-5 right-5 p-5 rounded-full shadow-lg transition text-2xl bg-blue-500 text-white hover:bg-blue-600 z-50">
          +
        </Link>
      )}

      <Toaster position="top-right" reverseOrder={false} />

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-2xl mb-4 text-center font-semibold">
              Edit Post {editingPost.id}
            </h3>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 mb-3 border rounded"
            />

            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 mb-3 border rounded"
            />

            <input
              type="url"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={handleSaveUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
