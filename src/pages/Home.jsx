import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const user = await authService.getCurrentUser();
        const uid = user?.$id;
        setCurrentUserId(uid);


        const docs = await appService.getPosts([
          Query.equal("userid", uid),
          Query.equal("status", "active"),
        ]);

        const enriched = await Promise.all(
          docs.map(async (doc) => {
            const imageUrl = await appService.getFilePreview(doc.featuredImage);
            return { ...doc, imageUrl };
          })
        );

        setPosts(enriched);
      } catch (err) {
        console.error("Error loading your posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-4">Loading your posts…</p>;
  if (posts.length === 0) return <p className="p-4">You have no posts yet.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      {posts.map((post) => (
        <div
          key={post.$id}
          onClick={() => navigate(`/post/${post.slug}`)}
          className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
        >

          <div className="w-full aspect-video overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>


          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.content}
            </p>


            <div className="flex justify-end space-x-4 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-post/${post.slug}`);
                }}
                className="text-green-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this post?")) {
                    appService
                      .deletePost(post.$id)
                      .then(() =>
                        setPosts((ps) => ps.filter((p) => p.$id !== post.$id))
                      );
                  }
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
