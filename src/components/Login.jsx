import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

   const onSubmit = async (data) => {
     setError("");
     try {
       const session = await authService.login(data);
       if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
         navigate("/");
       }
     } catch (error) {
       setError(error.message);
     }
   };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Sign In
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          {...register("email", { required: true })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          {...register("password", { required: true })}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </Typography>
    </Box>
  );
}
