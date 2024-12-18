"use client";
import ResponsiveView from "@/components/Container";
import { Box, Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reroute = searchParams.get("reroute");

  const isSuccess = status === "success";

  return (
    <ResponsiveView>
      {isSuccess ? (
        <Typography variant="h4">Great! You're registered.</Typography>
      ) : (
        <Typography variant="h4">Oops! Registration Failed.</Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          isSuccess
            ? reroute
              ? router.push(`/pay/${reroute}`)
              : router.push("/registration")
            : router.push("/registration")
        }
        fullWidth
      >
        {isSuccess
          ? reroute
            ? "Back to your payment..."
            : "Register new user"
          : "Try again"}
      </Button>
    </ResponsiveView>
  );
}
