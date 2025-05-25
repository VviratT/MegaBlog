import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
import PostForm from "../components/post-form/PostForm";
import appService from "../appwrite/service";

export default function EditPost() {
  const { slug } = useParams();
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    (async () => {
      const doc = await appService.getPostBySlug(slug);
      setExisting(doc);
    })();
  }, [slug]);

  return (
    <Box sx={{ pt: 10, px: 2 }}>
      {!existing ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Edit Post
          </Typography>
          <PostForm existing={existing} />
        </Paper>
      )}
    </Box>
  );
}
