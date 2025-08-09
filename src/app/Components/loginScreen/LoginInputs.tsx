"use client";
import { domineName } from "@/app/utils/tokenName";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginInputs = () => {
  // Remove the parameter here
  const router = useRouter();
  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeState = (e: any, name: string) => {
    setLoginInputs({ ...loginInputs, [name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    // Move the parameter here
    e.preventDefault();

    if (!loginInputs.email.trim() || !loginInputs.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!loginInputs.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (loginInputs.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("hi hi ");
      
      const response = await axios.post(`${domineName}/api/login`, loginInputs);
      console.log("Login successful:", response.data);

      // Clear form
      setLoginInputs({
        email: "",
        password: "",
      });

      // Navigate to home page
      router.push("/");

      location.reload();
    } catch (error: any) {
      // console.error("Login error:", error);

      // if (error.response?.data?.message) {
      // setError(error.response.data.message);
      // }
      // if (error.response?.status === 401) {
      setError("Invalid email or password");
      // } else if (error.response?.status >= 500) {
      // setError("Server error. Please try again later");
      // } else {
      // setError("Login failed. Please try again");
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        backgroundColor: "#f5f5f5",
        flexDirection: "column",
        gap:1.4
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 4,
          borderRadius: 2,
        }}
      >
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
          }}
        >
          Log in
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin} // Add the onSubmit handler here
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            variant="outlined"
            value={loginInputs.email}
            name="email"
            id="email"
            onChange={(e) => changeState(e, "email")}
            disabled={loading}
          />

          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            variant="outlined"
            value={loginInputs.password}
            name="password"
            id="password"
            onChange={(e) => changeState(e, "password")}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Paper>
      <Box>
        {/* --- INSIDE the form, right under the Login button --- */}
        <Button
          component={Link}
          href="/register"
          variant="outlined"
          size="large"
          fullWidth
          disabled={loading}
          sx={{
            py: 1,
            fontSize: "1rem",
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "#fff",
            },
          }}
        >
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

export default LoginInputs;
