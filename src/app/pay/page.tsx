"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import VideoFeed from "@/components/VideoFeed";
import axios from "axios";

export default function PaymentPage() {
  const [step, setStep] = useState(1);
  // const [loading, setLoading] = useState(false);
  const router = useRouter();

  const bestPrediction = (faces: any[]) => {
    return faces.reduce(
      (prev, curr) => (curr.confidence > prev.confidence ? curr : prev),
      faces[0]
    );
  };

  const onCapture = async (image_b64: any) => {
    try {
      // setLoading(true); // Start loading
      const response = await axios.post(
        "http://localhost:5002/recognize_face",
        {
          // TODO: don't hardcode, set up proxy
          image: image_b64,
        }
      );
      console.log("API Response:", response.data);

      const customer = bestPrediction(response.data.faces);

      router.push(`/confirmation?custName=${customer.name}`);
    } catch (err) {
      console.error("Error during registration:", err);
      // TODO: take this up later
      //   router.push("/pay/failure");
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
        {step < 2 && (
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
              Welcome to the Payment Gateway
            </Typography>
            <Typography variant="body1">
              Click next to start the payment process.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              fullWidth
            >
              Next
            </Button>
            <Button
              variant="text"
              color="info"
              onClick={() => router.push("/registration")}
              fullWidth
              sx={{ mt: 2 }}
            >
              New user? Register here
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h4" gutterBottom>
              Prepare for Face Scan
            </Typography>
            <Typography variant="body1">
              Ensure your face is clearly visible in the frame.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              fullWidth
            >
              Start Scan
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <IconButton
              color="inherit"
              onClick={handlePreviousStep}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom>
              Scanning Your Face...
            </Typography>
            <VideoFeed onCapture={onCapture} btnLabel="Pay" />
          </>
        )}
      </Box>
    </Box>
  );
}
