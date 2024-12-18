"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoFeed from "@/components/VideoFeed";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { numbersRegex, phoneNumberRegex } from "@/utils/regex";
import ResponsiveView from "@/components/Container";

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reroute = {
    reroute: searchParams.get("reroute") || null,
  };

  const handleNextStep = () => {
    if (
      step === 1 &&
      !Boolean(credentials.name.trim()) &&
      !Boolean(credentials.phone.trim())
    ) {
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

  // TODO: add field validation for phone
  // const phoneValidations = (value: string): boolean => {
  //   if (value && !value.match(numbersRegex) && value.length > 10) return false;
  //   return true;
  // };

  const onInputChange = (fieldName: string, value: string) => {
    setCredentials({ ...credentials, [fieldName]: value });
  };

  const onCapture = async (image_b64: any) => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post("http://172.20.10.5:5000/register", {
        // TODO: don't hardcode, set up proxy
        name: credentials.name,
        image: image_b64,
      });
      console.log("API Response:", response.data);
      router.push(
        `/registration/confirmation?status=success${
          reroute && `&reroute=${reroute}`
        }`
      );
    } catch (err) {
      console.error("Error during registration:", err);
      router.push("/registration/confirmation?status=failure");
    } finally {
      setLoading(false);
    }
  };

  // TODO: How to incorporte like this in a better way?
  // const RegistrationFlow = ({ credentials, onInputChange }: any) => {
  //   return (
  //     <>
  //       {step > 1 && (
  //         <IconButton
  //           color="inherit"
  //           onClick={handlePreviousStep}
  //           sx={{ alignSelf: "flex-start" }}
  //           edge="start"
  //         >
  //           <ArrowBackIcon />
  //         </IconButton>
  //       )}

  //       {step === 1 && (
  //         <>
  //           <Typography variant="h4" gutterBottom>
  //             Welcome to HDFC Pay by Face! Let's get you registered.
  //           </Typography>
  //           {/* TODO: Why are textfields focusing out after one character input? */}
  //           <TextField
  //             label="Enter your Name"
  //             variant="outlined"
  //             fullWidth
  //             value={credentials.name}
  //             onInputChange={(e) => onInputChange("name", e.target.value)}
  //             InputProps={{ style: { color: "#fff" } }}
  //             InputLabelProps={{ style: { color: "#fff" } }}
  //             sx={{ ".MuiOutlinedInput-root": { borderColor: "#fff" } }}
  //           />
  //           <TextField
  //             label="Enter registered Phone Number"
  //             variant="outlined"
  //             type="tel"
  //             fullWidth
  //             value={credentials.phone}
  //             onInputChange={(e) => onInputChange("phone", e.target.value)}
  //             InputProps={{ style: { color: "#fff" } }}
  //             InputLabelProps={{ style: { color: "#fff" } }}
  //             sx={{ ".MuiOutlinedInput-root": { borderColor: "#fff" } }}
  //           />
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             onClick={handleNextStep}
  //             fullWidth
  //             sx={{ mt: 2 }}
  //             disabled={
  //               !Boolean(credentials.name.trim()) ||
  //               !Boolean(credentials.phone.trim())
  //             }
  //           >
  //             Next
  //           </Button>
  //         </>
  //       )}

  //       {step === 2 && (
  //         <>
  //           <Typography variant="h4">
  //             {/* // TODO: personalize: get name from API call... */}
  //             Hi {credentials.name}, let's register your face.
  //           </Typography>
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             onClick={handleNextStep}
  //             fullWidth
  //           >
  //             Start Face Registration
  //           </Button>
  //         </>
  //       )}

  //       {step === 3 && (
  //         <VideoFeed onCapture={onCapture} btnLabel="Register Face" />
  //       )}
  //     </>
  //   );
  // };

  return (
    <ResponsiveView>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {step > 1 && (
            <IconButton
              color="inherit"
              onClick={handlePreviousStep}
              sx={{ alignSelf: "flex-start" }}
              edge="start"
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {step === 1 && (
            <>
              <Typography variant="h4" gutterBottom>
                Welcome to HDFC Pay by Face! Let's get you registered.
              </Typography>
              {/* TODO: Why are textfields focusing out after one character input? */}
              <TextField
                label="Enter your Name"
                variant="outlined"
                fullWidth
                value={credentials.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{ ".MuiOutlinedInput-root": { borderColor: "#fff" } }}
              />
              <TextField
                label="Enter registered Phone Number"
                variant="outlined"
                type="tel"
                fullWidth
                value={credentials.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
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
                disabled={
                  !Boolean(credentials.name.trim()) ||
                  !Boolean(credentials.phone.trim())
                }
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h4">
                {/* // TODO: personalize: get name from API call... */}
                Hi {credentials.name}, let's register your face.
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
            <VideoFeed onCapture={onCapture} btnLabel="Register Face" />
          )}
        </>
      )}
    </ResponsiveView>
  );
}
