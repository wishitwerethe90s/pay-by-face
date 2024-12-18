"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const custName = searchParams.get("custName");
  const txnAmt = searchParams.get("amount");
  const accNo = searchParams.get("accNo");

  const isSuccess = custName !== "null";

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
          gap: 3,
          width: "100%",
          maxWidth: 400,
          p: 3,
          borderRadius: 2,
          bgcolor: "#1E1E1E",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        {isSuccess ? (
          <>
            <Typography variant="h4" gutterBottom>
              Payment Successful 🎉
            </Typography>
            <Typography variant="h5">
              Amount {txnAmt} is debited from your account {accNo}
            </Typography>
            <Typography variant="body1" align="center">
              Hi {custName}, your payment has been processed successfully!
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Payment Failed ❌
            </Typography>
            <Typography variant="body1" align="center">
              Unfortunately, we couldn't process your payment. Please try again
              later or contact support.
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/pay")}
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
      </Box>
    </Box>
  );
}
