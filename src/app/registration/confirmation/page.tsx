"use client";
import ResponsiveView from "@/components/Container";
import { Box, Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reroute = searchParams.get("reroute") || null;

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
          reroute
            ? isSuccess
              ? router.push(`/pay${reroute}`)
              : router.push(
                  `/registration?reroute=${encodeURIComponent(reroute)}`
                )
            : router.push("/registration")
        }
        fullWidth
      >
        {reroute
          ? isSuccess
            ? "Back to your payment..."
            : "Try again"
          : "Register new user"}
      </Button>
    </ResponsiveView>
  );
}
