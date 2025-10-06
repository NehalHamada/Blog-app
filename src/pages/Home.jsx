import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function Home({
  users,
  user,
  posts,
  handleDelete,
  handleUpdate,
}) {
  return (
    <div className="min-h-screen bg-base-200 py-10 px-5">
      <div className="max-w-5xl mx-auto space-y-6">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const postAuthor = users?.find((u) => u.name === post.author);

            return (
              <Motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="card lg:card-side bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-300 cursor-pointer">
                {post.image && (
                  <figure className="lg:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-64 rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                    />
                  </figure>
                )}
                <div className="card-body p-6 space-y-4">
                  <h3 className="post-title card-title text-2xl font-bold text-primary">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{post.body}</p>

                  <div className="card-actions justify-between items-center mt-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={
                              postAuthor?.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                post.author
                              )}&background=random&rounded=true`
                            }
                            alt={post.author}
                            className="border-none outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {post.author}
                      </p>
                    </div>

                    {/* Edit/Delete buttons */}
                    {user && user.name === post.author && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(post)}
                          className="btn edit-btn">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="btn bg-error text-white">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Motion.div>
            );
          })
        ) : (
          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-gray-500 text-lg font-medium">
            No posts available
          </Motion.p>
        )}
      </div>
    </div>
  );
}
