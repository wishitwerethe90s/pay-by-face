"use client";

import ResponsiveView from "@/components/Container";
import { Box, Button, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

const mockTxnDetails = {
  orderDetails: {
    orderId: (Math.random() * 100000).toFixed(),
    amount: (Math.random() * 1000).toFixed(2),
  },
  merchantDetails: { name: "Amazon India Pvt. Ltd." },
};

export default function Home() {
  const searchParams = useSearchParams();
  const orderDetails = {
    orderId: searchParams.get("orderId") || mockTxnDetails.orderDetails.orderId,
    amount: searchParams.get("amount") || mockTxnDetails.orderDetails.amount,
  };

  return (
    <ResponsiveView>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome to Payment Gateway
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        href={`/pay?orderId=${orderDetails.orderId}&amount=${orderDetails.amount}`}
      >
        Make a payment by face
      </Button>
      <Button variant="text" color="primary" fullWidth href="/registration">
        New user? Register here
      </Button>
    </ResponsiveView>
  );
}
