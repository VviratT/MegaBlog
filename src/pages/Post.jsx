import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setCurrentUserId(user?.$id || null);

      const res = await appService.getPostBySlug(slug);
      const imageUrl = res.featuredImage
        ? await appService.getFilePreview(res.featuredImage)
        : null;

      setPost({ ...res, imageUrl });
    })();
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await appService.deletePost(post.$id);
    navigate("/all-posts");
  };

  if (!post) return <p>Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto object-contain mb-6 rounded-lg shadow"
        />
      )}
      <h1 className="text-2xl font-bold">{post.title}</h1>
      
      <div
        className="prose mt-4" 
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.userid === currentUserId && (
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate(`/edit-post/${slug}`)}
            className="text-green-600"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
