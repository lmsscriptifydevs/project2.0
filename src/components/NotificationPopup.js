import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import axios from "axios";

// Define your modal styling (adjust as needed)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

const NotificationPopup = ({ selectedNotification, onClose, onAccepted }) => {
  // Handle the acceptance process
  const handleAccept = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // Assuming your notification data includes 'offer_id' and 'order_id' at the top level of data
      const { offer_id, order_id } = selectedNotification.data;
      const response = await axios.post(
        "/api/accept-offer-invitation",
        { offer_id, order_id },
        {
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Accept": "application/json",
          },
        }
      );
      onAccepted(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to accept invitation", error);
      alert("Failed to accept invitation. Please try again.");
    }
  };

  if (!selectedNotification) return null;

  // Extract the inner notification data that contains the buyer request details.
  // According to your sample, these keys are nested under data.data.
  const notifData = selectedNotification.data.data || {};

  return (
    <Modal open={Boolean(selectedNotification)} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          {notifData["buyer_request-title"] || "Job Invitation"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {notifData["buyer_request-description"] || "No additional details provided."}
        </Typography>
        <Button variant="contained" onClick={handleAccept}>
          Accept Invitation
        </Button>
      </Box>
    </Modal>
  );
};

export default NotificationPopup;
