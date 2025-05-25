import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import PostForm from "../components/post-form/PostForm";

export default function AddPost() {
  return (
    <Box sx={{ pt: 10, px: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create Post
        </Typography>
        <PostForm />
      </Paper>
    </Box>
  );
}
