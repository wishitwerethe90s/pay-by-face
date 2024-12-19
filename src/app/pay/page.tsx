"use client";

import React, { useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import VideoFeed from "@/components/VideoFeed";
import axios from "axios";
import TxnDetails from "@/components/TxnDetails";
import ResponsiveView from "@/components/Container";
import { bestPrediction } from "@/utils/face-detection-utils";

const mockTxnDetails = {
  orderDetails: {
    orderId: (Math.random() * 100000).toFixed(),
    amount: (Math.random() * 1000).toFixed(2),
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const orderDetails = {
    orderId: searchParams.get("orderId") || mockTxnDetails.orderDetails.orderId,
    amount: searchParams.get("amount") || mockTxnDetails.orderDetails.amount,
  };

  const onCapture = async (image_b64: any) => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post(
        "http://172.20.10.5:5000/recognize_face",
        {
          // TODO: don't hardcode, set up proxy
          image: image_b64,
        }
      );
      console.log("API Response:", response.data);

      // const customer = bestPrediction(response.data.faces);
      const customer = response.data;

      router.push(
        `/pay/confirmation?status=success&custName=${customer.name}&orderId=${orderDetails.orderId}&amount=${orderDetails.amount}`
      );
    } catch (err) {
      router.push("/pay/confirmation?status=failure");
      console.error("Error during registration:", err);
    } finally {
      setLoading(false);
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

  const PaymentFlow = () => {
    return (
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
            <Typography variant="h4">Welcome to HDFC Pay By Face</Typography>
            <TxnDetails orderDetails={orderDetails} />
            <Typography variant="body2">
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
              onClick={() =>
                router.push(
                  `/registration?reroute=${encodeURIComponent(
                    `?orderId=${orderDetails.orderId}&amount=${orderDetails.amount}`
                  )}`
                )
              }
              fullWidth
              sx={{ mt: 2 }}
            >
              New user? Register here
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h4">Prepare for Face Scan</Typography>
            <TxnDetails orderDetails={orderDetails} />
            <Typography variant="body2">
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
            <Typography variant="h4" gutterBottom>
              Scanning Your Face...
            </Typography>
            <VideoFeed onCapture={onCapture} btnLabel="Pay" />
          </>
        )}
      </>
    );
  };

  return (
    <ResponsiveView>
      {loading ? <CircularProgress /> : <PaymentFlow />}
    </ResponsiveView>
  );
}
