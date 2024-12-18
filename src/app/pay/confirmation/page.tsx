"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveView from "@/components/Container";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const custName = searchParams.get("custName");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";

  return (
    <ResponsiveView>
      {isSuccess ? (
        <>
          <Typography variant="h4">Payment Successful 🎉</Typography>
          <Typography variant="h5">
            Amount {amount} is debited from your account against order:{" "}
            {orderId}
          </Typography>
          <Typography variant="body1" align="center">
            Hi {custName}, your payment has been processed successfully!
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment Failed ❌</Typography>
          <Typography variant="body1" align="center">
            Unfortunately, we couldn't process your payment. Please try again
            later or contact support.
          </Typography>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          isSuccess
            ? router.push("/pay")
            : router.push(`/pay?orderId=${orderId}&amount=${amount}`)
        }
        fullWidth
      >
        {isSuccess ? "Make Another Payment" : "Try Again"}
      </Button>
      {!isSuccess && (
        <Button
          variant="text"
          color="info"
          onClick={() => router.push("/registration")}
          fullWidth
          sx={{ mt: 2 }}
        >
          New user? Register here
        </Button>
      )}
    </ResponsiveView>
  );
}
