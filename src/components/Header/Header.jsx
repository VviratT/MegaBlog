import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ColorModeContext } from "../../ThemeProviderWrapper";
import LogoutBtn from './LogoutBtn';

export default function Header() {
  const auth = useSelector((state) => state.auth.status);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const location = useLocation().pathname;

  const links = [
    { label: "Home", path: "/" },
    ...(auth
      ? [
          { label: "All Posts", path: "/all-posts" },
          { label: "Add Post", path: "/add-post" },
        ]
      : [
          { label: "Login", path: "/login" },
          { label: "Signup", path: "/signup" },
        ]),
  ];

  return (
    <AppBar position="fixed" elevation={4}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">MegaBlog</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {links.map(({ label, path }) => (
            <Button
              key={path}
              component={NavLink}
              to={path}
              end={path === "/"}
              sx={{
                color: "inherit",
                bgcolor: location === path ? "primary.light" : "transparent",
              }}
            >
              {label}
            </Button>
          ))}
          {auth && <LogoutBtn />}
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
