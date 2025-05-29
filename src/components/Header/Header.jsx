import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ColorModeContext } from "../../ThemeProviderWrapper";
import authService from "../../appwrite/auth";
import appService from "../../appwrite/service";
import { logout as logoutAction } from "../../store/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const location = useLocation().pathname;

  const userName = auth.userData?.name;
  const userId = auth.userData?.$id;
  const userPhotoId = auth.userData?.prefs?.profileImage;
  const userPhotoUrl = userPhotoId ? appService.getFileView(userPhotoId) : null;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Nav links vary based on auth.status
  const links = [
    { label: "Home", path: "/" },
    ...(auth.status
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
        <Typography variant="h6">DhananjayBlogs</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* theme toggle */}
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>

          {/* dynamic nav links */}
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

          {/* when logged in, show avatar, name and logout */}
          {auth.status && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                src={userPhotoUrl}
                alt={userName}
                sx={{ width: 32, height: 32 }}
              >
                {!userPhotoUrl && userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle2">{userName}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
