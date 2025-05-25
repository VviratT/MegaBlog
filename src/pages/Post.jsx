import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setUserId(user?.$id);

      const doc = await appService.getPostBySlug(slug);
      const imageUrl = await appService.getFilePreview(doc.featuredImage);
      setPost({ ...doc, imageUrl });
    })();
  }, [slug]);

  if (!post) {
    return <Box sx={{ pt: 10, px: 2 }}>Loading…</Box>;
  }

  return (
    <Box sx={{ pt: 10, px: 2, maxWidth: "md", mx: "auto" }}>
      {/* Full-width image */}
      <Box
        component="img"
        src={post.imageUrl}
        alt={post.title}
        sx={{ width: "100%", borderRadius: 2, mb: 2 }}
      />

      {/* Title */}
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>

      {/* Rendered HTML content */}
      <Box
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
        sx={{ mb: 3 }}
      />

      {/* Edit/Delete buttons if this is your post */}
      {post.userid === userId && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/edit-post/${slug}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              if (window.confirm("Delete this post?")) {
                appService.deletePost(post.$id).then(() => {
                  navigate("/all-posts");
                });
              }
            }}
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
}
