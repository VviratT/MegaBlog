import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Pagination,
  TextField,
  Fab,
  Skeleton,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";
import { Query } from "appwrite";

export default function PostsList({ ownOnly = false }) {
  const nav = useNavigate();
  const [posts, setPosts] = useState([]);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setUid(user?.$id);
      const filters = ownOnly
        ? [Query.equal("userid", user.$id), Query.equal("status", "active")]
        : [Query.equal("status", "active")];
      const docs = await appService.getPosts(filters);
      const enriched = await Promise.all(
        docs.map(async (d) => ({
          ...d,
          imageUrl: d.featuredImage
            ? await appService.getFileView(d.featuredImage)
            : null,
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
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ pt: 10, px: 2, textAlign: "center" }}>
      <TextField
        placeholder={ownOnly ? "Search your posts…" : "Search posts…"}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        variant="outlined"
        size="small"
        sx={{ mb: 3, width: "100%", maxWidth: 400 }}
      />

      <Grid container spacing={2} justifyContent="center" alignItems="stretch">
        {(loading ? Array(perPage).fill(null) : slice).map((p, i) => (
          <Grid
            key={p?.$id ?? i}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {loading ? (
              <Skeleton variant="rectangular" width={280} height={350} />
            ) : (
              <Card
                onClick={() => nav(`/post/${p.slug}`)}
                sx={{
                  width: 280,
                  height: 350,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                {p.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={p.imageUrl}
                    alt={p.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
                  <Typography variant="h6" noWrap>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  {p.userid === uid && (
                    <>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          nav(`/edit-post/${p.slug}`);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm("Delete this post?")) {
                            await appService.deletePost(p.$id);
                            setPosts((ps) => ps.filter((x) => x.$id !== p.$id));
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, v) => setPage(v)}
        color="primary"
        sx={{ mt: 3 }}
      />

      <Fab
        color="primary"
        onClick={() => nav("/add-post")}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
      >
        <Add />
      </Fab>
    </Box>
  );
}
