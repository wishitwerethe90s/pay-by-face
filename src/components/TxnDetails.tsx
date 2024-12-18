import { Divider, Stack, Typography } from "@mui/material";

const TxnDetails = ({ orderDetails }: any) => {
  return (
    <Stack
      border="solid 1px rgb(109, 109, 109)"
      padding={1}
      gap={1}
      width="100%"
    >
      <Typography variant="h5">Order Details</Typography>
      <Divider sx={{ bgcolor: "rgb(109,109,109)" }} />
      <Typography variant="body1">Order ID: {orderDetails.orderId}</Typography>
      <Typography variant="body1">Amount: Rs. {orderDetails.amount}</Typography>
    </Stack>
  );
};

export default TxnDetails;
