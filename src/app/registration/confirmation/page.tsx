"use client";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();

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
        <Typography variant="h4" gutterBottom>
          Great! You're registered.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/registration")}
          fullWidth
        >
          Register new user
        </Button>
      </Box>
    </Box>
  );
}
