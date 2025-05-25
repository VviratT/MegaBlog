import React, { useEffect, useState, useMemo } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  InputAdornment,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Pagination,
  Fab,
  Skeleton,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";
import { Query } from "appwrite";

export default function PostsList({ ownOnly = false }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const location = useLocation().pathname;

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setUserId(user?.$id);
      const filters = ownOnly
        ? [Query.equal("userid", user.$id), Query.equal("status", "active")]
        : [Query.equal("status", "active")];
      const docs = await appService.getPosts(filters);
      const enriched = await Promise.all(
        docs.map(async (d) => ({
          ...d,
          imageUrl: await appService.getFilePreview(d.featuredImage),
        }))
      );
      setPosts(enriched);
      setLoading(false);
    })();
  }, [ownOnly]);

  const filtered = useMemo(
    () =>
      posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [posts, search]
  );

  const pageCount = Math.ceil(filtered.length / perPage);
  const current = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );

  return (
    <Box
      sx={{
        pt: 10,
        px: 2,
        bgcolor: "background.default",
        minHeight: "calc(100vh - 128px)",
      }}
    >
      {/* ——— Stylish Search Bar ——— */}
      <TextField
        placeholder={ownOnly ? "Search your posts…" : "Search all posts…"}
        fullWidth
        size="small"
        variant="outlined"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{
          mb: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* ——— Card Grid ——— */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "flex-start",
        }}
      >
        {(loading ? Array(perPage).fill(null) : current).map((post, idx) => (
          <Box key={post?.$id || idx}>
            {loading ? (
              <Skeleton variant="rectangular" width="25vw" height="35vh" />
            ) : (
              <Card
                sx={{
                  width: "25vw",
                  height: "45vh",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.04)", boxShadow: 6 },
                }}
                onClick={() => navigate(`/post/${post.slug}`)}
              >
                {/* — More space for image: ~60% height — */}
                <CardMedia
                  component="img"
                  sx={{ height: "60%", flexShrink: 0 }}
                  image={post.imageUrl}
                  alt={post.title}
                />

                {/* — More compact description — */}
                <CardContent
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    p: 1,
                    pt: 1,
                  }}
                >
                  <Typography variant="subtitle1" noWrap>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ mt: 0.5, fontSize: "0.85rem" }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>

                <CardActions disableSpacing sx={{ justifyContent: "flex-end" }}>
                  {post.userid === userId && <>{/* edit/delete as before */}</>}
                </CardActions>
              </Card>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Box>

      <Fab
        color="primary"
        onClick={() => navigate("/add-post")}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>
    </Box>
  );
}
