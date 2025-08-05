"use client";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const LoginInputs = () => {
  const [regesterInputs, setRegesterInputs] = useState({
    email: "",
    password: "",
  });

  const changeState = (e: any, name: string) => {
    setRegesterInputs({ ...regesterInputs, [name]: e.target.value });
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
          //   onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            required
            label="email"
            variant="outlined"
            value={regesterInputs.email}
            name="email"
            id="email"
            onChange={(e) => changeState(e, "email")}
          />
          <TextField
            fullWidth
            required
            label="password"
            variant="outlined"
            value={regesterInputs.password}
            name="password"
            id="password"
            onChange={(e) => changeState(e, "password")}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginInputs;
