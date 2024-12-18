import { Box } from "@mui/material";

const ResponsiveView = ({ children, ...otherProps }: any) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#121212",
        color: "#fff",
        p: 3,
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
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveView;
