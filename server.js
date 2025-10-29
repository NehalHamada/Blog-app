import express from "express";
import fs from "fs";
import path from "path";
// import cors from "cors";

const app = express();
// app.use(cors());
const PORT = 5001;

app.use(express.json());

const __dirname = path.resolve();
const dataFile = path.join(__dirname, "src", "data.json");

// HELPERS

// read whole data.json
function getData() {
  if (!fs.existsSync(dataFile)) {
    return { users: [], posts: [], tokens: [] };
  }
  const data = fs.readFileSync(dataFile, "utf-8");
  if (!data.trim()) return { users: [], posts: [], tokens: [] };
  return JSON.parse(data);
}

// save back to data.json
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const data = getData();

  if (!data.tokens || !data.tokens.includes(token)) {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
}

// USERS

// Get all users
app.get("/api/users", (req, res) => {
  const data = getData();
  res.json(data.users);
});

// Add user (protected)
app.post("/api/users", authMiddleware, (req, res) => {
  const data = getData();

  const maxId =
    data.users.length > 0
      ? Math.max(...data.users.map((u) => parseInt(u.id) || 0))
      : 0;
  const newUser = { id: String(maxId + 1), ...req.body }; // Use string ID for consistency
  data.users.push(newUser);
  saveData(data);
  res.status(201).json(newUser);
});

// Update user (protected)
app.put("/api/users/:id", authMiddleware, (req, res) => {
  const data = getData();
  const userId = req.params.id; // Keep as string to match data format
  const index = data.users.findIndex((u) => u.id == userId); // Use == for type coercion
  if (index === -1) return res.status(404).json({ message: "User not found" });

  data.users[index] = { ...data.users[index], ...req.body };
  saveData(data);
  res.json(data.users[index]);
});

// Delete user (protected)
app.delete("/api/users/:id", authMiddleware, (req, res) => {
  let data = getData();
  const userId = req.params.id; // Keep as string to match data format

  const userIndex = data.users.findIndex((u) => u.id == userId); // Use == for type coercion
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  const userToDelete = data.users[userIndex];

  // Delete user's posts (cascade deletion)
  data.posts = data.posts.filter((p) => p.userId != userId);

  // Delete the user
  data.users = data.users.filter((u) => u.id != userId);

  saveData(data);

  res.json({
    message: "User deleted successfully",
    deletedUser: userToDelete,
    users: data.users,
  });
});

// POSTS

// Get all posts
app.get("/api/posts", (req, res) => {
  const data = getData();
  res.json(data.posts);
});

// Add post (protected)
app.post("/api/posts", authMiddleware, (req, res) => {
  const data = getData();
  const maxId =
    data.posts.length > 0
      ? Math.max(...data.posts.map((p) => parseInt(p.id) || 0))
      : 0;
  const newPost = { id: String(maxId + 1), ...req.body }; // Use string ID for consistency
  data.posts.push(newPost);
  saveData(data);
  res.status(201).json(newPost);
});

// Update post (protected)
app.put("/api/posts/:id", authMiddleware, (req, res) => {
  const data = getData();
  const postId = req.params.id; // Keep as string to match data format
  const index = data.posts.findIndex((p) => p.id == postId); // Use == for type coercion
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  data.posts[index] = { ...data.posts[index], ...req.body };
  saveData(data);
  res.json(data.posts[index]);
});

// Delete post (protected)
app.delete("/api/posts/:id", authMiddleware, (req, res) => {
  console.log("we are here");
  let data = getData();
  const postId = req.params.id; // Keep as string to match data format

  const postIndex = data.posts.findIndex((p) => p.id == postId); // Use == for type coercion
  if (postIndex === -1)
    return res.status(404).json({ message: "Post not found" });

  const postToDelete = data.posts[postIndex];

  // Delete the post
  data.posts = data.posts.filter((p) => p.id != postId);

  saveData(data);

  res.json({
    message: "Post deleted successfully",
    deletedPost: postToDelete,
    posts: data.posts,
  });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const data = getData();
  const users = data.users;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Fake token
  const fakeToken = Math.random().toString(36).substring(2);

  // Store token in data.json
  if (!data.tokens) data.tokens = [];
  data.tokens.push(fakeToken);
  saveData(data);

  res.json({
    message: "Login successful",
    token: fakeToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
