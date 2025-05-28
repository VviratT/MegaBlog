import React, { useState } from "react";
import { Box, TextField, Button, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      // Upload avatar if provided
      let profileImage = null;
      if (file) {
        profileImage = await appService.uploadFile(file);
      }

      // Create the user account
      await authService.createAccount({ email, password, name });

      // Save profileImage in prefs
      if (profileImage) {
        await authService.updatePrefs({ profileImage });
      }

      //Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Signup error", err);
      alert("Failed to sign up");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
        Sign Up
      </Typography>

      <TextField
        label="Name"
        fullWidth
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={file && URL.createObjectURL(file)}
          sx={{ width: 56, height: 56, mr: 2 }}
        >
          {!file && name.charAt(0).toUpperCase()}
        </Avatar>
        <Button variant="contained" component="label">
          Upload Avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </Button>
      </Box>

      <Button type="submit" variant="contained" fullWidth disabled={busy}>
        {busy ? "Creating…" : "Sign Up"}
      </Button>
    </Box>
  );
}
