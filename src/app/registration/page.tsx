"use client";

import React, { useState } from "react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoFeed from "@/components/VideoFeed";
import axios from "axios";

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1 && name.trim() !== "") {
      setStep(2);
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onCapture = async (image_b64: any) => {
    try {
      // setLoading(true); // Start loading
      const response = await axios.post("/api/capture", {
        data: { name: name, image: image_b64 },
      });
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Error during registration:", err);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 400,
          p: 3,
          borderRadius: 2,
          bgcolor: "#1E1E1E",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        {step > 1 && (
          <IconButton
            color="inherit"
            onClick={handlePreviousStep}
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {step === 1 && (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome! Let's get you registered.
            </Typography>
            <TextField
              label="Enter your name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={handleNameChange}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#fff" } }}
              sx={{ ".MuiOutlinedInput-root": { borderColor: "#fff" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              fullWidth
              sx={{ mt: 2 }}
              disabled={name.trim() === ""}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h4" gutterBottom>
              Hi {name}, let's register your face.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              fullWidth
            >
              Start Face Registration
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <VideoFeed onCapture={onCapture} />
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => handleNextStep()}
              fullWidth
            >
              Register Face
            </Button> */}
          </>
        )}
      </Box>
    </Box>
  );
}
