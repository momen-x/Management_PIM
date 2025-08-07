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
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterInputs = () => {
  const router = useRouter();
  const [registerInputs, setRegisterInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeState = (e: any, name: string) => {
    setRegisterInputs({ ...registerInputs, [name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    
    if (
      !registerInputs.name.trim() ||
      !registerInputs.email.trim() ||
      !registerInputs.password.trim() ||
      !registerInputs.confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (registerInputs.password !== registerInputs.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!registerInputs.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (registerInputs.password.length < 8) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const createNewAccount = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${domineName}/api/register`,
        registerInputs
      );

      console.log("User created successfully:", response.data);

      // Clear form
      setRegisterInputs({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to home page
      location.reload();
      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle different error types
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setError("User with this email already exists");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later");
      } else {
        setError("Registration failed. Please try again");
      }
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
          Register
        </Typography>

        <Box
          component="form"
          onSubmit={createNewAccount} // Handle form submission properly
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            required
            variant="outlined"
            label="Full Name"
            value={registerInputs.name}
            name="name"
            id="name"
            onChange={(e) => changeState(e, "name")}
            disabled={loading}
          />

          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            variant="outlined"
            value={registerInputs.email}
            name="email"
            id="email"
            onChange={(e) => changeState(e, "email")}
            disabled={loading}
          />

          <TextField
            fullWidth
            type="password"
            required
            label="Password"
            variant="outlined"
            value={registerInputs.password}
            name="password"
            id="password"
            onChange={(e) => changeState(e, "password")}
            disabled={loading}
          />

          <TextField
            fullWidth
            required
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={registerInputs.confirmPassword}
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => changeState(e, "confirmPassword")}
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterInputs;
