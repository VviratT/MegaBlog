import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    // Center a spinner while auth check is in progress
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

      {/* Outlet renders the matched route */}
      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: "background.default",
          px: 2,
          pb: 8,
          pt: 10, // to offset the fixed AppBar height
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
